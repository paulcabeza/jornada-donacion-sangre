"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LabelList } from "recharts";
import { Users, Droplets, MapPin, TrendingUp, Calendar, Phone, Mail } from "lucide-react";

interface Estadisticas {
  totalDonantes: number;
  donantesPorBarrio: { id: string; nombre: string; cantidad: number }[];
  donantesPorTipoSangre: { tipo: string; cantidad: number }[];
}

interface Donante {
  id: string;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono?: string;
  email?: string;
  tipoSangre: string;
  fechaDonacion: string;
  barrio: { id: string; nombre: string };
}

export default function HomePage() {
  const [estadisticas, setEstadisticas] = useState<Estadisticas | null>(null);
  const [donantesBarrio, setDonantesBarrio] = useState<Donante[]>([]);
  const [barrioSeleccionado, setBarrioSeleccionado] = useState<string>("");
  const [modalAbierto, setModalAbierto] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    cargarEstadisticas();
  }, []);

  const cargarEstadisticas = async () => {
    try {
      const response = await fetch("/api/estadisticas");
      const data = await response.json();
      setEstadisticas(data);
    } catch (error) {
      console.error("Error loading estadisticas:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const verDonantesBarrio = async (barrioId: string, nombreBarrio: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/donantes?barrioId=${barrioId}`);
      const donantes = await response.json();
      setDonantesBarrio(donantes);
      setBarrioSeleccionado(nombreBarrio);
      setModalAbierto(true);
    } catch (error) {
      console.error("Error loading donantes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const calcularDominioY = (data: { cantidad: number }[]) => {
    if (!data || data.length === 0) return [0, 10];
    
    const maxCantidad = Math.max(...data.map(item => item.cantidad));
    
    if (maxCantidad === 0) return [0, 10];
    if (maxCantidad <= 10) return [0, 15];
    if (maxCantidad <= 20) return [0, 25];
    if (maxCantidad <= 50) return [0, Math.ceil(maxCantidad * 1.3)];
    
    return [0, Math.ceil(maxCantidad * 1.2)];
  };

  const generarTicks = (max: number) => {
    if (max <= 25) return [0, 5, 10, 15, 20, 25];
    if (max <= 50) {
      const step = Math.ceil(max / 5);
      return Array.from({ length: 6 }, (_, i) => i * step);
    }
    
    const step = Math.ceil(max / 5);
    return Array.from({ length: 6 }, (_, i) => i * step);
  };

  // Componente personalizado para las etiquetas de las barras
  const CustomLabel = (props: any) => {
    const { x, y, width, value } = props;
    
    if (!value || value === 0) return null;
    
    return (
      <g>
        {/* Fondo redondeado */}
        <rect
          x={x + width / 2 - 20}
          y={y - 35}
          width={40}
          height={24}
          rx={12}
          fill="#ffffff"
          stroke="#ef4444"
          strokeWidth={1.5}
          filter="drop-shadow(0 2px 4px rgba(0,0,0,0.1))"
        />
        {/* Texto */}
        <text
          x={x + width / 2}
          y={y - 20}
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fontWeight="600"
          fill="#ef4444"
        >
          {value}
        </text>
      </g>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Droplets className="h-12 w-12 text-red-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Jornada de Donación de Sangre - Estaca Cuzcatlán
          </h1>
          <p className="text-2xl text-gray-600">
            18-Julio-2025
          </p>
        </div>

        {/* Estadísticas principales */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-red-100">Total Donantes</p>
                  <p className="text-4xl font-bold">{estadisticas?.totalDonantes || 0}</p>
                </div>
                <Users className="h-12 w-12 text-red-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Barrios Activos</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {estadisticas?.donantesPorBarrio?.filter(b => b.cantidad > 0).length || 0}
                  </p>
                </div>
                <MapPin className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Tipos de Sangre</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {estadisticas?.donantesPorTipoSangre?.length || 0}
                  </p>
                </div>
                <Droplets className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos y Beneficios */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Gráfico de barrios */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Donantes por Barrio</CardTitle>
              <CardDescription>
                Haz clic en una barra para ver los donantes de ese barrio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={estadisticas?.donantesPorBarrio || []}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="nombre" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis 
                      domain={calcularDominioY(estadisticas?.donantesPorBarrio || [])}
                      ticks={generarTicks(calcularDominioY(estadisticas?.donantesPorBarrio || [])[1])}
                    />
                    <Tooltip />
                    <Bar 
                      dataKey="cantidad" 
                      fill="#ef4444"
                      cursor="pointer"
                      onClick={(data) => {
                        if (data.payload) {
                          verDonantesBarrio(data.payload.id, data.payload.nombre);
                        }
                      }}
                    >
                      <LabelList 
                        dataKey="cantidad" 
                        content={<CustomLabel />}
                      />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Sección de Beneficios y Contactos */}
          <Card>
            <CardHeader>
              <CardTitle>¿Y tú, ya te apuntaste para donar sangre?</CardTitle>
              <CardDescription>
                Estos son algunos beneficios de participar en la donación de sangre:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Beneficios */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Beneficios:</h4>
                  <ul className="space-y-2 text-gray-700 mb-4">
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Salvas hasta 3 vidas con una sola donación</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Reduce el hierro en sangre (previene enfermedades)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Estimula la producción de nuevas células</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Recibes análisis gratuito de tu sangre</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Mejora tu bienestar emocional</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-red-600 font-bold">•</span>
                      <span>Proceso seguro y solo toma 10-15 minutos</span>
                    </li>
                  </ul>
                  
                  <Button asChild className="w-full">
                    <a href="/beneficios">
                      Ver Más Beneficios
                    </a>
                  </Button>
                </div>

                {/* Contactos */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-900 mb-3">Contactos para Donación:</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Si deseas anotarte para donar sangre o tienes preguntas, puedes contactar a:
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">Daniel Sanchez</span>
                      <a 
                        href="https://wa.me/50378535413" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        +503 7853-5413
                      </a>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">Rosibel de Sanchez</span>
                      <a 
                        href="https://wa.me/50376695869" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        +503 7669-5869
                      </a>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium">Fredy Matute</span>
                      <a 
                        href="https://wa.me/50375730824" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                      >
                        <Phone className="h-3 w-3" />
                        +503 7573-0824
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navegación */}
        <div className="text-center">
          <Button variant="outline" asChild>
            <a href="/registro">Ver Listado de Donantes</a>
          </Button>
        </div>

        {/* Modal de donantes por barrio */}
        <Dialog open={modalAbierto} onOpenChange={setModalAbierto}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Donantes de {barrioSeleccionado}</DialogTitle>
              <DialogDescription>
                Lista completa de donantes registrados en este barrio
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4">
              {donantesBarrio.length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No hay donantes registrados en este barrio
                </p>
              ) : (
                donantesBarrio.map((donante, index) => (
                  <Card key={donante.id} className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Correlativo */}
                      <div className="text-center flex-shrink-0">
                        <div className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 font-semibold rounded-full text-sm">
                          {index + 1}
                        </div>
                      </div>
                      
                      {/* Información principal */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg mb-1">
                          {donante.nombre} {donante.apellido}
                        </h3>
                        {donante.email && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="h-4 w-4 flex-shrink-0" />
                            <span className="truncate">{donante.email}</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Tipo de sangre */}
                      <div className="text-center flex-shrink-0">
                        <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-1">
                          <span className="text-red-600 font-bold text-sm">
                            {donante.tipoSangre}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Tipo de Sangre</p>
                      </div>
                      
                      {/* Fecha */}
                      <div className="text-right flex-shrink-0">
                        <div className="flex items-center justify-end gap-1 mb-1">
                          <Calendar className="h-3 w-3 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formatearFecha(donante.fechaDonacion)}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500">Fecha de donación</p>
                      </div>
                    </div>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
