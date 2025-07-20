import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Heart, Users, Shield, Activity, ArrowLeft, CheckCircle, Phone } from "lucide-react";

export default function BeneficiosPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
      {/* Header */}
      <div className="text-center py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Droplets className="h-16 w-16 text-red-600" />
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Beneficios de Donar Sangre
          </h1>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Donar sangre no solo salva vidas, también tiene múltiples beneficios para tu salud y bienestar. 
            Descubre por qué este acto de generosidad es tan importante.
          </p>

          <Button variant="outline" asChild className="mb-8">
            <a href="/admin">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver al Dashboard
            </a>
          </Button>
        </div>
      </div>

      {/* Beneficios Principales */}
      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Beneficio 1 */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-xl">Salvas Vidas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Una sola donación puede salvar hasta 3 vidas. Tu sangre puede ser utilizada para 
                  pacientes con emergencias, cirugías, tratamientos contra el cáncer y más.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Beneficio 2 */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Activity className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">Beneficios para tu Salud</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  La donación regular reduce los niveles de hierro en sangre, previniendo 
                  enfermedades hepáticas y cardíacas. También estimula la médula ósea 
                  para producir nuevas células sanguíneas.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Beneficio 3 */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-xl">Chequeo Médico Gratuito</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Cada donación incluye un análisis básico de tu sangre, verificando tu tipo sanguíneo, 
                  niveles de hemoglobina y detección de enfermedades infecciosas.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Beneficio 4 */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-purple-600" />
                </div>
                <CardTitle className="text-xl">Impacto Social</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Tu donación contribuye a mantener un suministro constante de sangre 
                  para emergencias, cirugías y tratamientos médicos en tu comunidad.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Beneficio 5 */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-orange-600" />
                </div>
                <CardTitle className="text-xl">Satisfacción Personal</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  El conocimiento de que has ayudado a salvar vidas genera una profunda 
                  satisfacción personal y mejora tu bienestar emocional.
                </CardDescription>
              </CardContent>
            </Card>

            {/* Beneficio 6 */}
            <Card className="border-2 hover:shadow-lg transition-shadow">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mb-4">
                  <Droplets className="h-8 w-8 text-pink-600" />
                </div>
                <CardTitle className="text-xl">Proceso Simple y Seguro</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  La donación es un proceso médico seguro que solo toma 10-15 minutos. 
                  Todo el material es estéril y de un solo uso.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Información Adicional */}
      <div className="py-16 px-4 bg-white/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            ¿Quieres Saber Más?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Proceso de Donación</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Registro y verificación de identidad</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Evaluación médica básica</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Extracción de sangre (10-15 minutos)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Descanso y refrigerio</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Requisitos Básicos</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Tener entre 18 y 65 años</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Pesar más de 50 kg</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>Gozar de buena salud</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span>No haber donado en los últimos 3 meses</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">
            ¿Listo para Hacer la Diferencia?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Tu donación puede ser el regalo más valioso que alguien reciba. 
            Únete a nuestra comunidad de donantes y salva vidas.
          </p>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Consulta con los siguientes contactos:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white/10 rounded-lg border border-white/20">
                  <h4 className="font-semibold text-lg mb-2">Rosibel de Sanchez</h4>
                  <a 
                    href="https://wa.me/50376695869" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-300 hover:text-green-200 font-medium flex items-center justify-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    +503 7669-5869
                  </a>
                </div>
                
                <div className="text-center p-4 bg-white/10 rounded-lg border border-white/20">
                  <h4 className="font-semibold text-lg mb-2">Daniel Sanchez</h4>
                  <a 
                    href="https://wa.me/50378535413" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-300 hover:text-green-200 font-medium flex items-center justify-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    +503 7853-5413
                  </a>
                </div>
                
                <div className="text-center p-4 bg-white/10 rounded-lg border border-white/20">
                  <h4 className="font-semibold text-lg mb-2">Fredy Matute</h4>
                  <a 
                    href="https://wa.me/50375730824" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-300 hover:text-green-200 font-medium flex items-center justify-center gap-2"
                  >
                    <Phone className="h-4 w-4" />
                    +503 7573-0824
                  </a>
                </div>
              </div>
            </div>
            
            <Button size="lg" variant="secondary" className="text-lg px-8 py-4" asChild>
              <a href="/admin">
                Ver Dashboard
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center mb-4">
            <Droplets className="h-8 w-8 text-red-400 mr-2" />
            <span className="text-xl font-semibold">Sistema de Donación de Sangre</span>
          </div>
          <p className="text-gray-400">
            Salvando vidas, una donación a la vez.
          </p>
        </div>
      </footer>
    </div>
  );
} 