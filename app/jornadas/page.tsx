"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Droplets, CheckCircle, AlertCircle, ArrowLeft, Lock, Calendar, Users, Plus } from "lucide-react";

interface Jornada {
  id: string;
  nombre: string;
  fecha: string;
  descripcion?: string | null;
  activa: boolean;
  _count: { donantes: number };
}

const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

export default function JornadasPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");
  const [authMessage, setAuthMessage] = useState<{ type: "error"; text: string } | null>(null);

  const [jornadas, setJornadas] = useState<Jornada[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [nombre, setNombre] = useState("");
  const [fecha, setFecha] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [activa, setActiva] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const cargarJornadas = () => {
    setIsLoading(true);
    fetch("/api/jornadas")
      .then((res) => res.json())
      .then((data) => setJornadas(Array.isArray(data) ? data : []))
      .catch((error) => console.error("Error loading jornadas:", error))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (isAuthorized) cargarJornadas();
  }, [isAuthorized]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true);
      setAuthMessage(null);
    } else {
      setAuthMessage({ type: "error", text: "Contraseña incorrecta" });
    }
  };

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!nombre || !fecha) {
      setMessage({ type: "error", text: "El nombre y la fecha son requeridos" });
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch("/api/jornadas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, fecha, descripcion, activa }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "¡Jornada creada exitosamente!" });
        setNombre("");
        setFecha("");
        setDescripcion("");
        setActiva(true);
        cargarJornadas();
      } else {
        const error = await response.json();
        setMessage({ type: "error", text: error.error || "Error al crear la jornada" });
      }
    } catch {
      setMessage({ type: "error", text: "Error de conexión" });
    } finally {
      setIsSaving(false);
    }
  };

  const marcarActiva = async (id: string) => {
    try {
      const response = await fetch(`/api/jornadas/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activa: true }),
      });
      if (response.ok) {
        cargarJornadas();
      }
    } catch (error) {
      console.error("Error setting active jornada:", error);
    }
  };

  const formatearFecha = (f: string) =>
    new Date(f).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  // Pantalla de contraseña
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Lock className="h-12 w-12 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Gestión de Jornadas</CardTitle>
            <CardDescription>
              Ingresa la contraseña para administrar las jornadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa la contraseña"
                  required
                />
              </div>

              {authMessage && (
                <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 text-red-700 border border-red-200">
                  <AlertCircle className="h-4 w-4" />
                  {authMessage.text}
                </div>
              )}

              <Button type="submit" className="w-full">
                Acceder
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button variant="outline" asChild>
                <a href="/historico">Volver al Histórico</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Pantalla autorizada
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Droplets className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Gestión de Jornadas</h1>
          <p className="text-gray-600">Crea jornadas y define cuál es la activa</p>
        </div>

        <div className="mb-6">
          <Button variant="outline" asChild className="flex items-center gap-2 w-fit">
            <a href="/historico">
              <ArrowLeft className="h-4 w-4" />
              Volver al Histórico
            </a>
          </Button>
        </div>

        {/* Formulario de creación */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Nueva Jornada
            </CardTitle>
            <CardDescription>Completa los datos para crear una nueva jornada</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCrear} className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre / Título *</Label>
                <Input
                  id="nombre"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  placeholder="Ej. Estaca Cuzcatlán"
                  required
                />
              </div>

              <div>
                <Label htmlFor="fecha">Fecha *</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={fecha}
                  onChange={(e) => setFecha(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  id="descripcion"
                  value={descripcion}
                  onChange={(e) => setDescripcion(e.target.value)}
                  placeholder="Opcional"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={activa}
                  onChange={(e) => setActiva(e.target.checked)}
                  className="h-4 w-4 accent-red-600"
                />
                <span className="text-sm text-gray-700">
                  Marcar como jornada activa (será la que se muestre por defecto)
                </span>
              </label>

              {message && (
                <div
                  className={`flex items-center gap-2 p-3 rounded-md ${
                    message.type === "success"
                      ? "bg-green-50 text-green-700 border border-green-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {message.type === "success" ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <AlertCircle className="h-4 w-4" />
                  )}
                  {message.text}
                </div>
              )}

              <Button type="submit" className="w-full" disabled={isSaving}>
                {isSaving ? "Creando..." : "Crear Jornada"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Lista de jornadas */}
        <Card>
          <CardHeader>
            <CardTitle>Jornadas existentes</CardTitle>
            <CardDescription>La jornada activa se muestra por defecto en el dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <p className="text-center text-gray-500 py-4">Cargando...</p>
            ) : jornadas.length === 0 ? (
              <p className="text-center text-gray-500 py-4">No hay jornadas todavía.</p>
            ) : (
              <div className="space-y-3">
                {jornadas.map((jornada) => (
                  <div
                    key={jornada.id}
                    className="flex items-center justify-between gap-4 p-4 rounded-lg border bg-white"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900">{jornada.nombre}</span>
                        {jornada.activa && (
                          <span className="inline-flex items-center rounded-full bg-green-100 text-green-700 text-xs font-medium px-2.5 py-0.5">
                            Activa
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          {formatearFecha(jornada.fecha)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-gray-400" />
                          {jornada._count.donantes}
                        </span>
                      </div>
                    </div>
                    {!jornada.activa && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => marcarActiva(jornada.id)}
                        className="flex-shrink-0"
                      >
                        Marcar activa
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
