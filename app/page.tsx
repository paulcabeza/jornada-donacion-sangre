import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, Users, BarChart3, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-pink-50 to-orange-50">
      {/* Hero Section */}
      <div className="text-center py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Droplets className="h-20 w-20 text-red-600" />
              <Heart className="h-8 w-8 text-red-500 absolute -top-2 -right-2" />
            </div>
          </div>
          
          <h1 className="text-6xl font-bold text-gray-900 mb-6">
            Donación de Sangre
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
            Un gesto que salva vidas. Únete a nuestra comunidad de donantes y ayuda a 
            quienes más lo necesitan. Tu sangre puede ser la esperanza de alguien.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button size="lg" className="text-lg px-8 py-4" asChild>
              <a href="/registro">
                <Users className="mr-2 h-6 w-6" />
                Gestionar Donantes
              </a>
            </Button>
            
            <Button size="lg" variant="outline" className="text-lg px-8 py-4" asChild>
              <a href="/admin">
                <BarChart3 className="mr-2 h-6 w-6" />
                Dashboard Admin
              </a>
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-4 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            ¿Por qué donar sangre?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-2xl">Salvas Vidas</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Una sola donación puede salvar hasta 3 vidas. Tu generosidad 
                  marca la diferencia en momentos críticos.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl">Comunidad</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Únete a una red de personas solidarias que trabajan juntas 
                  para hacer un impacto positivo en la sociedad.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center border-2 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl">Seguimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-lg">
                  Mantén un registro de tus donaciones y ve el impacto 
                  colectivo de nuestra comunidad de donantes.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-20 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">
            ¿Listo para hacer la diferencia?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            El proceso es simple, seguro y solo toma unos minutos. 
            Tu donación puede ser el regalo más valioso que alguien reciba.
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4" asChild>
            <a href="/registro">
              Ver Donantes
            </a>
          </Button>
        </div>
      </div>


    </div>
  );
}
