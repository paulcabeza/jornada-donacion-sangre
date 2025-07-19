"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Users, Droplets, MapPin, TrendingUp, Calendar, Phone, Mail, IdCard } from "lucide-react";

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

const COLORES = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", 
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"
];

export default function AdminDashboard() {
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

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de barrios */}
          <Card>
            <CardHeader>
              <CardTitle>Donantes por Barrio</CardTitle>
              <CardDescription>
                Haz clic en una barra para ver los donantes de ese barrio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
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
                    <YAxis />
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
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Gráfico de tipos de sangre */}
          <Card>
            <CardHeader>
              <CardTitle>Distribución por Tipo de Sangre</CardTitle>
              <CardDescription>
                Proporción de donantes según su tipo de sangre
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={estadisticas?.donantesPorTipoSangre || []}
                      dataKey="cantidad"
                      nameKey="tipo"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ tipo, cantidad }) => `${tipo}: ${cantidad}`}
                    >
                      {estadisticas?.donantesPorTipoSangre?.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORES[index % COLORES.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
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
                donantesBarrio.map((donante) => (
                  <Card key={donante.id} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">
                          {donante.nombre} {donante.apellido}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <IdCard className="h-4 w-4" />
                            {donante.cedula}
                          </div>
                          {donante.telefono && (
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              {donante.telefono}
                            </div>
                          )}
                          {donante.email && (
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              {donante.email}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-2">
                          <span className="text-red-600 font-bold text-lg">
                            {donante.tipoSangre}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">Tipo de Sangre</p>
                      </div>
                      
                      <div className="text-right">
                        <div className="flex items-center justify-end gap-2 mb-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
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