
import React, { useState, useCallback } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ResultEntry, ChartData } from './types';
import { getGenerativeContent } from './services/geminiService';

// --- Helper & UI Components (defined outside App to prevent re-creation on re-renders) ---

const Section: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <section className={`py-12 md:py-16 ${className}`}>
    <div className="container mx-auto px-4 md:px-6">
      <h2 className="text-3xl md:text-4xl font-bold text-center text-sky-400 mb-8 md:mb-12">{title}</h2>
      {children}
    </div>
  </section>
);

const IconWrapper: React.FC<{ icon: React.ReactNode, children: React.ReactNode }> = ({ icon, children }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 text-sky-400 mt-1">{icon}</div>
        <div>{children}</div>
    </div>
);

const ProcedureStep: React.FC<{ step: string; description: string }> = ({ step, description }) => (
    <div className="relative pl-8 sm:pl-10 py-2 border-l-2 border-slate-700">
        <div className="absolute -left-4 h-8 w-8 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center font-bold text-sky-400">{step}</div>
        <p className="text-slate-300">{description}</p>
    </div>
);


const GeminiInsight: React.FC<{ content: string; isLoading: boolean; error: string | null; prompt: string, onGenerate: (prompt:string) => void }> = ({ content, isLoading, error, prompt, onGenerate }) => {
    return (
        <div className="mt-4 p-4 rounded-lg bg-slate-800 border border-slate-700">
            <button
                onClick={() => onGenerate(prompt)}
                disabled={isLoading}
                className="mb-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 disabled:bg-slate-500 disabled:cursor-not-allowed"
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                    </>
                ) : 'Generate AI Insight'}
            </button>
            {error && <div className="text-red-400"><p><strong>Error:</strong> {error}</p></div>}
            {content && <div className="prose prose-invert prose-sm max-w-none text-slate-300" dangerouslySetInnerHTML={{ __html: content.replace(/\n/g, '<br />') }}></div>}
        </div>
    );
};


// --- Main App Component ---

export default function App() {
  const [geminiInsights, setGeminiInsights] = useState<{ [key: string]: string }>({});
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const [errorStates, setErrorStates] = useState<{ [key: string]: string | null }>({});

  const handleGenerateInsight = useCallback(async (key: string, prompt: string) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
    setErrorStates(prev => ({ ...prev, [key]: null }));
    setGeminiInsights(prev => ({ ...prev, [key]: '' }));

    try {
      const responseText = await getGenerativeContent(prompt);
      setGeminiInsights(prev => ({ ...prev, [key]: responseText }));
    } catch (err) {
      setErrorStates(prev => ({ ...prev, [key]: err instanceof Error ? err.message : 'An unknown error occurred.' }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [key]: false }));
    }
  }, []);

  const resultsData: ResultEntry[] = [
    { id: 1, medium: 'Agua', initialHardness: '85 HRB', finalHardness: '58 HRC', variation: '+215%', observations: 'Color gris oscuro, sin fisuras visibles.' },
    { id: 2, medium: 'Aceite', initialHardness: '88 HRB', finalHardness: '45 HRC', variation: '+150%', observations: 'Superficie más oscura, leve deformación.' },
    { id: 3, medium: 'Aceite (Acero B)', initialHardness: '82 HRB', finalHardness: '38 HRC', variation: '+120%', observations: 'Sin cambios dimensionales notorios.' },
  ];

  const chartData: ChartData[] = [
      { name: 'Barra 1 (Agua)', Dureza_Inicial: 85, Dureza_Final: 58 * 2.5 }, // Approximation for visualization
      { name: 'Barra 2 (Aceite)', Dureza_Inicial: 88, Dureza_Final: 45 * 2.5 },
      { name: 'Barra 3 (Acero B)', Dureza_Inicial: 82, Dureza_Final: 38 * 2.5 },
  ];
  
  const labPhotos = [
      "https://picsum.photos/seed/lab1/600/400",
      "https://picsum.photos/seed/lab2/600/400",
      "https://picsum.photos/seed/lab3/600/400",
      "https://picsum.photos/seed/lab4/600/400",
  ];

  const conclusionQuestions = [
    { key: 'q1', text: '¿Qué medio de enfriamiento produjo mayor dureza? ¿Por qué?', prompt: 'In steel quenching, which cooling medium (water or oil) produces greater hardness and why? Explain the metallurgical principles, including cooling rates and microstructural transformations like martensite formation.' },
    { key: 'q2', text: '¿Qué relación existe entre la velocidad de enfriamiento y la formación de martensita?', prompt: 'Describe the relationship between the cooling rate and martensite formation in steel. Why is a critical cooling rate necessary?' },
    { key: 'q3', text: '¿Qué tipo de estructura cristalina se forma en el acero templado?', prompt: 'What is the primary crystal structure formed in quenched steel that is responsible for its high hardness? Describe its characteristics (e.g., Body-Centered Tetragonal - BCT) and why it is so hard and brittle.' },
    { key: 'q4', text: '¿Qué ventajas y desventajas presenta el templado en agua respecto del templado en aceite?', prompt: 'Compare and contrast water quenching versus oil quenching for steel. Discuss the advantages and disadvantages of each in terms of final hardness, risk of cracking, distortion, and typical applications.' },
    { key: 'q5', text: '¿Qué hipótesis pueden plantearse sobre la composición de los aceros según su respuesta al templado?', prompt: 'Based on different hardness outcomes after quenching, what hypotheses can be made about the chemical composition of different steels? Specifically, discuss the role of carbon content and alloying elements on hardenability.' },
  ];


  return (
    <div className="bg-slate-900 text-slate-300 font-sans leading-relaxed">
      {/* Header */}
      <header className="bg-slate-800/50 backdrop-blur-sm shadow-lg py-6 sticky top-0 z-50">
          <div className="container mx-auto px-4 md:px-6 text-center">
              <p className="text-sky-400 font-semibold">Tecnicatura Superior en Mecatrónica - Materiales</p>
              <h1 className="text-4xl md:text-5xl font-bold text-white mt-2">TP 02: Tratamientos Térmicos</h1>
              <p className="text-slate-400 mt-2">Estudiante: [Nombre del Alumno] | Docente: Ing. Bernardo Mendez</p>
          </div>
      </header>
      
      <main>
        {/* Objectives */}
        <Section title="Objetivos del Ensayo">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">Comprender el principio del tratamiento térmico de templado en aceros.</div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">Observar los cambios en la dureza producidos por diferentes medios de enfriamiento.</div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">Analizar la relación entre estructura cristalina y propiedades mecánicas.</div>
            <div className="bg-slate-800 p-6 rounded-lg border border-slate-700">Comparar el comportamiento de distintos aceros ante el mismo tratamiento.</div>
          </div>
        </Section>
        
        {/* Theoretical Concepts */}
        <Section title="Conceptos Teóricos: El Templado" className="bg-slate-950">
            <div className="max-w-3xl mx-auto text-center text-lg">
                <p className="mb-4">El templado es un tratamiento térmico que incrementa la dureza y resistencia del acero. Consiste en calentar el material a una temperatura crítica para formar austenita, y luego enfriarlo bruscamente. Este enfriamiento rápido transforma la austenita en martensita, una estructura cristalina extremadamente dura y frágil, responsable del aumento de las propiedades mecánicas.</p>
                <p>La velocidad de enfriamiento es crucial: el agua proporciona un enfriamiento muy rápido, resultando en máxima dureza pero con alto riesgo de fisuras. El aceite, un medio más suave, reduce estos riesgos a costa de una dureza ligeramente menor.</p>
                <GeminiInsight 
                    key="theory"
                    content={geminiInsights['theory']}
                    isLoading={loadingStates['theory']}
                    error={errorStates['theory']}
                    prompt="Explain the science behind steel quenching for a college student. Cover the phase transformations from austenite to martensite, the role of cooling rates, and compare water vs. oil as quenching media. Use analogies if helpful."
                    onGenerate={(prompt) => handleGenerateInsight('theory', prompt)}
                />
            </div>
        </Section>

        {/* Materials and Procedure */}
        <Section title="Materiales y Procedimiento">
            <div className="grid lg:grid-cols-2 gap-12">
                <div>
                    <h3 className="text-2xl font-bold text-sky-400 mb-6 text-center">Materiales y Equipos</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-center">
                        {['Horno Mufla', 'Barras de Acero', 'Recipiente con Agua', 'Recipiente con Aceite', 'Pinzas Metálicas', 'Guantes Térmicos', 'Durómetro', 'Antiparras'].map(item => (
                            <div key={item} className="bg-slate-800 p-4 rounded-lg border border-slate-700">
                                <img src={`https://picsum.photos/seed/${item}/200`} alt={item} className="w-full h-24 object-cover rounded-md mb-2" />
                                <span className="font-semibold text-sm">{item}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div>
                    <h3 className="text-2xl font-bold text-sky-400 mb-6 text-center">Procedimiento Experimental</h3>
                    <div className="space-y-2">
                        <ProcedureStep step="A1" description="Medir y registrar la dureza inicial de las 3 barras de acero." />
                        <ProcedureStep step="B1" description="Calentar las barras en el horno a ~850 °C por 10 minutos." />
                        <ProcedureStep step="B2" description="Retirar las barras y enfriarlas rápidamente: Barra 1 en agua, Barra 2 y 3 en aceite." />
                        <ProcedureStep step="B3" description="Dejar que las barras alcancen temperatura ambiente." />
                        <ProcedureStep step="C1" description="Medir y registrar la dureza final de las 3 barras." />
                        <ProcedureStep step="C2" description="Comparar y analizar los valores iniciales y finales." />
                    </div>
                </div>
            </div>
        </Section>

        {/* Results */}
        <Section title="Resultados Obtenidos" className="bg-slate-950">
            <div className="grid lg:grid-cols-5 gap-8">
                <div className="lg:col-span-3">
                    <h3 className="text-2xl font-bold text-white mb-4 text-center">Tabla de Dureza</h3>
                     <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-800">
                                    <th className="p-3 font-semibold text-sm text-sky-400 border-b-2 border-slate-700">Barra</th>
                                    <th className="p-3 font-semibold text-sm text-sky-400 border-b-2 border-slate-700">Medio</th>
                                    <th className="p-3 font-semibold text-sm text-sky-400 border-b-2 border-slate-700">Dureza Inicial</th>
                                    <th className="p-3 font-semibold text-sm text-sky-400 border-b-2 border-slate-700">Dureza Final</th>
                                    <th className="p-3 font-semibold text-sm text-sky-400 border-b-2 border-slate-700">Variación</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-700">
                                {resultsData.map((row) => (
                                    <tr key={row.id} className="bg-slate-800/50 hover:bg-slate-800 transition-colors duration-200">
                                        <td className="p-3">{row.id}</td>
                                        <td className="p-3">{row.medium}</td>
                                        <td className="p-3">{row.initialHardness}</td>
                                        <td className="p-3 font-bold text-green-400">{row.finalHardness}</td>
                                        <td className="p-3 font-bold text-green-400">{row.variation}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="mt-4 text-sm text-slate-400 p-3 bg-slate-800/50 rounded-lg">
                        <strong>Observaciones Generales:</strong> {resultsData.map(r => `Barra ${r.id}: ${r.observations}`).join(' ')}
                    </div>
                </div>
                <div className="lg:col-span-2">
                    <h3 className="text-2xl font-bold text-white mb-4 text-center">Comparación Gráfica</h3>
                     <div className="w-full h-80 bg-slate-800 p-4 rounded-lg border border-slate-700">
                        <ResponsiveContainer>
                            <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                                <YAxis stroke="#94a3b8" fontSize={12} label={{ value: 'Dureza Relativa', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155' }} labelStyle={{ color: '#cbd5e1' }}/>
                                <Legend wrapperStyle={{color: "#cbd5e1"}}/>
                                <Bar dataKey="Dureza_Inicial" fill="#60a5fa" name="Inicial" />
                                <Bar dataKey="Dureza_Final" fill="#4ade80" name="Final (Templado)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
            <div className="mt-12">
                <h3 className="text-2xl font-bold text-white mb-4 text-center">Galería del Laboratorio</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {labPhotos.map((photo, index) => (
                        <img key={index} src={photo} alt={`Lab photo ${index + 1}`} className="w-full h-auto object-cover rounded-lg shadow-lg border-2 border-slate-700 hover:border-sky-500 transition-all duration-300 transform hover:scale-105" />
                    ))}
                </div>
            </div>
        </Section>
        
        {/* Conclusions */}
        <Section title="Análisis y Conclusiones">
            <div className="max-w-4xl mx-auto space-y-6">
              {conclusionQuestions.map((q) => (
                <div key={q.key} className="bg-slate-800 p-6 rounded-lg border border-slate-700">
                    <p className="font-semibold text-lg text-slate-200">{q.text}</p>
                    <GeminiInsight 
                        content={geminiInsights[q.key]}
                        isLoading={loadingStates[q.key]}
                        error={errorStates[q.key]}
                        prompt={q.prompt}
                        onGenerate={(prompt) => handleGenerateInsight(q.key, prompt)}
                    />
                </div>
              ))}
            </div>
        </Section>

        {/* Safety Norms */}
        <Section title="Normas de Seguridad" className="bg-red-900/20">
            <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-6">
                <IconWrapper icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>}>
                    <h4 className="font-bold text-red-300">Precaución con Altas Temperaturas</h4>
                    <p className="text-red-400">No manipular piezas calientes sin pinzas y guantes térmicos adecuados.</p>
                </IconWrapper>
                <IconWrapper icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}>
                    <h4 className="font-bold text-red-300">Supervisión Constante</h4>
                    <p className="text-red-400">No realizar el temple sin la supervisión del docente a cargo.</p>
                </IconWrapper>
                <IconWrapper icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.657 7.343A8 8 0 0117.657 18.657z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.879 16.121A3 3 0 1014.12 11.88l-4.242 4.242z" /></svg>}>
                    <h4 className="font-bold text-red-300">Riesgo de Salpicaduras</h4>
                    <p className="text-red-400">Evitar la presencia de humedad en el aceite para prevenir salpicaduras o incendios.</p>
                </IconWrapper>
                <IconWrapper icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>}>
                    <h4 className="font-bold text-red-300">Equipo de Protección</h4>
                    <p className="text-red-400">Usar siempre antiparras, guardapolvo y guantes durante todo el procedimiento.</p>
                </IconWrapper>
            </div>
        </Section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-950 py-6">
          <div className="container mx-auto px-4 md:px-6 text-center text-slate-500">
              <p>Generado con React, Tailwind CSS y la API de Google Gemini.</p>
          </div>
      </footer>
    </div>
  );
}
