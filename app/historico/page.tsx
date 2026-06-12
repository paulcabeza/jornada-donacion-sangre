"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Droplets, History, Users, Calendar, ArrowLeft, ChevronRight, Settings } from "lucide-react";

interface Jornada {
  id: string;
  nombre: string;
  fecha: string;
  descripcion?: string | null;
  activa: boolean;
  _count: { donantes: number };
}

export default function HistoricoPage() {
  const [jornadas, setJornadas] = useState<Jornada[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/jornadas")
      .then((res) => res.json())
      .then((data) => setJornadas(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error loading jornadas:", error))
      .finally(() => setIsLoading(false));
  }, []);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Droplets className="h-12 w-12 text-red-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Cargando jornadas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <History className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Histórico de Jornadas
          </h1>
          <p className="text-gray-600">
            Selecciona una jornada para ver sus donantes y estadísticas
          </p>
        </div>

        {/* Lista de jornadas */}
        {jornadas.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <History className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No hay jornadas registradas todavía.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {jornadas.map((jornada) => (
              <a
                key={jornada.id}
                href={jornada.activa ? "/" : `/?jornada=${jornada.id}`}
                className="block"
              >
                <Card className="transition-colors hover:bg-gray-50 hover:border-red-200">
                  <CardContent className="p-5">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="font-semibold text-lg text-gray-900">
                            {jornada.nombre}
                          </h3>
                          {jornada.activa && (
                            <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5">
                              Activa
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            {formatearFecha(jornada.fecha)}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-gray-400" />
                            {jornada._count.donantes} donantes
                          </span>
                        </div>
                      </div>
                      <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    </div>
                  </CardContent>
                </Card>
              </a>
            ))}
          </div>
        )}

        {/* Navegación */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-8">
          <Button variant="outline" asChild>
            <a href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Volver al Dashboard
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/jornadas" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Gestionar Jornadas
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
