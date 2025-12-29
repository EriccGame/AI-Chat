import React, { useState, useEffect, useRef } from 'react';
import * as webllm from '@mlc-ai/web-llm';

const DEFAULT_PROMPTS = {
  albanileria: `Eres un experto maestro albañil con más de 20 años de experiencia en construcción y albañilería. Tu especialidad incluye:

- Construcción de muros, cimientos y estructuras
- Técnicas de mezcla de cemento, mortero y concreto
- Instalación de ladrillos, bloques y piedras
- Acabados y revestimientos
- Reparaciones y mantenimiento de estructuras
- Herramientas y materiales de construcción
- Cálculo de materiales y presupuestos
- Normas de seguridad en construcción
- Técnicas tradicionales y modernas de albañilería

Responde siempre de manera práctica, clara y profesional. Incluye consejos de seguridad cuando sea relevante.`,

  general: `Eres un asistente de IA útil, conocedor y amigable. Puedes ayudar con una amplia variedad de temas y preguntas. Responde de manera clara, precisa y útil.`,

  programacion: `Eres un experto desarrollador de software con amplia experiencia en múltiples lenguajes de programación, frameworks y mejores prácticas. Ayudas con código, debugging, arquitectura y consejos de desarrollo.`,

  educacion: `Eres un tutor experto que puede explicar conceptos complejos de manera simple y clara. Adaptas tu estilo de enseñanza según el nivel del estudiante y usas ejemplos prácticos.`,

  negocios: `Eres un consultor de negocios experimentado con conocimientos en estrategia, marketing, finanzas y gestión empresarial. Proporcionas consejos prácticos y basados en datos.`,

  salud: `Eres un asistente informativo sobre temas de salud y bienestar. Proporcionas información general educativa, pero siempre recomiendas consultar con profesionales médicos para diagnósticos y tratamientos específicos.`
};

const MODEL_ID = 'Llama-3.1-8B-Instruct-q4f32_1-MLC';

function App() {
  const [engine, setEngine] = useState(null);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isModelLoading, setIsModelLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('');
  const [webGPUSupported, setWebGPUSupported] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState('albanileria');
  const [customPrompt, setCustomPrompt] = useState('');
  const [showPromptSettings, setShowPromptSettings] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Verificar soporte de WebGPU
  useEffect(() => {
    const checkWebGPUSupport = async () => {
      if (!navigator.gpu) {
        setWebGPUSupported(false);
        return;
      }
      
      try {
        const adapter = await navigator.gpu.requestAdapter();
        setWebGPUSupported(!!adapter);
      } catch (error) {
        console.error('Error checking WebGPU support:', error);
        setWebGPUSupported(false);
      }
    };

    checkWebGPUSupport();
  }, []);

  // Auto-scroll al final de los mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Inicializar el modelo
  const initializeModel = async () => {
    if (!webGPUSupported) {
      alert('WebGPU no está soportado en este navegador. Por favor, usa Chrome/Edge con WebGPU habilitado.');
      return;
    }

    setIsModelLoading(true);
    setLoadingProgress(0);
    setLoadingText('Inicializando motor de IA...');

    try {
      const engineInstance = new webllm.MLCEngine();
      
      // Configurar callback de progreso
      engineInstance.setInitProgressCallback((progress) => {
        setLoadingProgress(Math.round(progress.progress * 100));
        setLoadingText(progress.text || 'Cargando modelo...');
      });

      // Inicializar con el modelo
      await engineInstance.reload(MODEL_ID);
      
      setEngine(engineInstance);
      setIsModelLoading(false);
      
      // Mensaje de bienvenida
      setMessages([{
        id: Date.now(),
        role: 'assistant',
        content: '¡Hola! Soy tu asistente experto en albañilería. Tengo más de 20 años de experiencia en construcción y estoy aquí para ayudarte con cualquier pregunta sobre albañilería, construcción, materiales, técnicas y herramientas. ¿En qué puedo ayudarte hoy?',
        timestamp: new Date()
      }]);
      
    } catch (error) {
      console.error('Error initializing model:', error);
      setIsModelLoading(false);
      alert('Error al cargar el modelo. Por favor, recarga la página e intenta de nuevo.');
    }
  };

  // Obtener el prompt actual
  const getCurrentSystemPrompt = () => {
    if (currentPrompt === 'custom') {
      return customPrompt || DEFAULT_PROMPTS.general;
    }
    return DEFAULT_PROMPTS[currentPrompt] || DEFAULT_PROMPTS.albanileria;
  };

  // Cambiar prompt y reiniciar conversación
  const changePrompt = (newPrompt) => {
    setCurrentPrompt(newPrompt);
    setShowPromptSettings(false);
    
    // Mensaje de bienvenida según el prompt
    const welcomeMessages = {
      albanileria: '¡Hola! Soy tu asistente experto en albañilería. ¿En qué puedo ayudarte hoy?',
      general: '¡Hola! Soy tu asistente de IA. Puedo ayudarte con una amplia variedad de temas. ¿En qué puedo ayudarte?',
      programacion: '¡Hola! Soy tu asistente experto en programación. ¿En qué proyecto o problema de código puedo ayudarte?',
      educacion: '¡Hola! Soy tu tutor personal. ¿Qué tema te gustaría aprender o repasar hoy?',
      negocios: '¡Hola! Soy tu consultor de negocios. ¿En qué aspecto de tu empresa puedo ayudarte?',
      salud: '¡Hola! Soy tu asistente de información sobre salud y bienestar. ¿En qué puedo ayudarte? (Recuerda consultar con profesionales médicos para diagnósticos específicos)',
      custom: '¡Hola! Soy tu asistente personalizado. ¿En qué puedo ayudarte hoy?'
    };

    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: welcomeMessages[newPrompt] || welcomeMessages.general,
      timestamp: new Date()
    }]);
  };

  // Enviar mensaje
  const sendMessage = async () => {
    if (!inputMessage.trim() || !engine || isLoading) return;

    const userMessage = {
      id: Date.now(),
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);
    setIsTyping(true);

    try {
      // Preparar el historial de conversación
      const conversation = [
        { role: 'system', content: getCurrentSystemPrompt() },
        ...messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        { role: 'user', content: userMessage.content }
      ];

      // Generar respuesta
      const response = await engine.chat.completions.create({
        messages: conversation,
        temperature: 0.7,
        max_tokens: 1000,
      });

      const aiMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: response.choices[0].message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: 'Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsTyping(false);
      inputRef.current?.focus();
    }
  };

  // Manejar Enter en el input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Limpiar conversación
  const clearChat = () => {
    setMessages([{
      id: Date.now(),
      role: 'assistant',
      content: '¡Hola! Soy tu asistente experto en albañilería. ¿En qué puedo ayudarte hoy?',
      timestamp: new Date()
    }]);
  };

  // Formatear timestamp
  const formatTime = (date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Pantalla de verificación de WebGPU
  if (webGPUSupported === false) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-900 to-red-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-red-600 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">WebGPU No Soportado</h2>
          <p className="text-gray-600 mb-6">
            Tu navegador no soporta WebGPU, que es necesario para ejecutar la IA localmente.
          </p>
          <div className="text-left bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="font-semibold mb-2">Soluciones:</h3>
            <ul className="text-sm space-y-1">
              <li>• Usa Chrome o Edge (versión reciente)</li>
              <li>• Habilita WebGPU en chrome://flags</li>
              <li>• Asegúrate de tener drivers de GPU actualizados</li>
            </ul>
          </div>
          <button 
            onClick={() => window.location.reload()} 
            className="btn-primary w-full"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Pantalla de carga del modelo
  if (isModelLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🏗️</div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Cargando Modelo de IA</h2>
            <p className="text-gray-600">Descargando Llama-3.1-8B desde HuggingFace...</p>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progreso</span>
              <span>{loadingProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="progress-bar h-3 rounded-full transition-all duration-300"
                style={{ width: `${loadingProgress}%` }}
              ></div>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 text-center">{loadingText}</p>
          
          <div className="mt-6 text-xs text-gray-400 text-center">
            <p>⚡ El modelo se descarga una sola vez y se guarda en caché</p>
            <p>🔒 Todo se ejecuta localmente en tu navegador</p>
          </div>
        </div>
      </div>
    );
  }

  // Pantalla principal del chat
  if (!engine) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full text-center">
          <div className="text-6xl mb-4">🏗️</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">AI Chat Albañilería</h1>
          <p className="text-gray-600 mb-6">
            Chatbot de IA especializado en albañilería que funciona 100% en tu navegador
          </p>
          
          <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
            <h3 className="font-semibold text-blue-800 mb-2">✅ Características:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• IA experta en construcción y albañilería</li>
              <li>• Funciona completamente offline</li>
              <li>• Privacidad total - nada sale de tu navegador</li>
              <li>• Modelo Llama-3.1-8B optimizado</li>
            </ul>
          </div>
          
          <button 
            onClick={initializeModel}
            className="btn-primary w-full text-lg py-3"
          >
            Inicializar IA
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            WebGPU detectado ✅ | Primera carga: ~2-3 GB
          </p>
        </div>
      </div>
    );
  }

  // Interfaz del chat
  return (
    <div className="chat-container bg-chat-bg text-white flex flex-col">
      {/* Header */}
      <div className="bg-chat-surface border-b border-chat-border p-4 flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="text-2xl">
            {currentPrompt === 'albanileria' ? '🏗️' : 
             currentPrompt === 'programacion' ? '💻' :
             currentPrompt === 'educacion' ? '📚' :
             currentPrompt === 'negocios' ? '💼' :
             currentPrompt === 'salud' ? '🏥' :
             currentPrompt === 'custom' ? '⚙️' : '🤖'}
          </div>
          <div>
            <h1 className="text-xl font-bold">
              {currentPrompt === 'albanileria' ? 'Maestro Albañil IA' :
               currentPrompt === 'programacion' ? 'Programador IA' :
               currentPrompt === 'educacion' ? 'Tutor IA' :
               currentPrompt === 'negocios' ? 'Consultor IA' :
               currentPrompt === 'salud' ? 'Asistente Salud IA' :
               currentPrompt === 'custom' ? 'Asistente Personalizado' : 'Asistente IA'}
            </h1>
            <p className="text-sm text-gray-400">
              {currentPrompt === 'albanileria' ? 'Experto en construcción y albañilería' :
               currentPrompt === 'programacion' ? 'Experto en desarrollo de software' :
               currentPrompt === 'educacion' ? 'Tutor especializado' :
               currentPrompt === 'negocios' ? 'Consultor empresarial' :
               currentPrompt === 'salud' ? 'Información de salud y bienestar' :
               currentPrompt === 'custom' ? 'Configuración personalizada' : 'Asistente general'}
            </p>
          </div>
        </div>
        <div className="flex space-x-2">
          <button 
            onClick={() => setShowPromptSettings(true)}
            className="btn-secondary text-sm"
          >
            ⚙️ Cambiar Modo
          </button>
          <button 
            onClick={clearChat}
            className="btn-secondary text-sm"
          >
            🗑️ Limpiar
          </button>
        </div>
      </div>

      {/* Modal de configuración de prompt */}
      {showPromptSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-chat-surface rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Configurar Asistente IA</h2>
                <button 
                  onClick={() => setShowPromptSettings(false)}
                  className="text-gray-400 hover:text-white text-2xl"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Selecciona el tipo de asistente:</h3>
                
                {/* Prompts predefinidos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {Object.entries({
                    albanileria: { name: 'Maestro Albañil', icon: '🏗️', desc: 'Experto en construcción y albañilería' },
                    general: { name: 'Asistente General', icon: '🤖', desc: 'Ayuda con cualquier tema' },
                    programacion: { name: 'Programador', icon: '💻', desc: 'Experto en desarrollo de software' },
                    educacion: { name: 'Tutor', icon: '📚', desc: 'Especialista en enseñanza' },
                    negocios: { name: 'Consultor', icon: '💼', desc: 'Experto en negocios' },
                    salud: { name: 'Salud & Bienestar', icon: '🏥', desc: 'Información de salud general' }
                  }).map(([key, info]) => (
                    <button
                      key={key}
                      onClick={() => changePrompt(key)}
                      className={`p-4 rounded-lg border-2 text-left transition-all ${
                        currentPrompt === key 
                          ? 'border-blue-500 bg-blue-900/30' 
                          : 'border-gray-600 bg-gray-800/50 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{info.icon}</span>
                        <div>
                          <div className="font-semibold text-white">{info.name}</div>
                          <div className="text-sm text-gray-400">{info.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Prompt personalizado */}
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-white mb-3">O crea tu propio asistente:</h4>
                  <textarea
                    value={customPrompt}
                    onChange={(e) => setCustomPrompt(e.target.value)}
                    placeholder="Describe cómo quieres que se comporte tu asistente IA personalizado..."
                    className="w-full h-32 bg-chat-bg border border-chat-border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
                  />
                  <button
                    onClick={() => changePrompt('custom')}
                    disabled={!customPrompt.trim()}
                    className={`mt-3 px-4 py-2 rounded-lg font-medium transition-colors ${
                      customPrompt.trim() 
                        ? 'bg-green-600 hover:bg-green-700 text-white' 
                        : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    ⚙️ Usar Prompt Personalizado
                  </button>
                </div>

                <div className="mt-6 p-4 bg-blue-900/30 rounded-lg">
                  <p className="text-sm text-blue-200">
                    💡 <strong>Tip:</strong> Cambiar el modo reiniciará la conversación. 
                    El asistente adoptará la nueva personalidad y especialización que selecciones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto messages-container p-4 space-y-4">
        {messages.map((message) => (
          <div 
            key={message.id} 
            className={`fade-in flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-xs lg:max-w-md xl:max-w-lg px-4 py-2 rounded-lg ${
              message.role === 'user' 
                ? 'bg-user-message text-white' 
                : 'bg-chat-surface text-gray-100'
            }`}>
              <p className="whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {formatTime(message.timestamp)}
              </p>
            </div>
          </div>
        ))}
        
        {/* Typing indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-chat-surface text-gray-100 px-4 py-2 rounded-lg typing-indicator">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="bg-chat-surface border-t border-chat-border p-4">
        <div className="flex space-x-2">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              currentPrompt === 'albanileria' ? 'Pregunta sobre albañilería, construcción, materiales...' :
              currentPrompt === 'programacion' ? 'Pregunta sobre código, frameworks, debugging...' :
              currentPrompt === 'educacion' ? 'Pregunta sobre cualquier tema que quieras aprender...' :
              currentPrompt === 'negocios' ? 'Pregunta sobre estrategia, marketing, finanzas...' :
              currentPrompt === 'salud' ? 'Pregunta sobre salud y bienestar...' :
              currentPrompt === 'custom' ? 'Escribe tu mensaje...' :
              'Pregunta sobre cualquier tema...'
            }
            className="flex-1 bg-chat-bg border border-chat-border rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="btn-primary px-6"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              '📤'
            )}
          </button>
        </div>
        
        <div className="mt-2 text-xs text-gray-400 text-center">
          Presiona Enter para enviar • Shift+Enter para nueva línea
        </div>
      </div>
    </div>
  );
}

export default App;
