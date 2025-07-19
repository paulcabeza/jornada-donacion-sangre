"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Droplets, CheckCircle, AlertCircle, ArrowLeft, Lock } from "lucide-react";

// Esquema de validación
const donanteSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  apellido: z.string().min(2, "El apellido debe tener al menos 2 caracteres"),
  cedula: z.string().min(8, "El DUI debe tener al menos 8 caracteres"),
  telefono: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  tipoSangre: z.string().min(1, "Selecciona un tipo de sangre"),
  barrioId: z.string().min(1, "Selecciona un barrio"),
});

type DonanteForm = z.infer<typeof donanteSchema>;

interface Barrio {
  id: string;
  nombre: string;
}

const tiposSangre = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Contraseña simple - puedes cambiarla por la que quieras
const ADMIN_PASSWORD = "admin123";

export default function NuevoRegistroPage() {
  const router = useRouter();
  const [barrios, setBarrios] = useState<Barrio[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [password, setPassword] = useState("");

  const form = useForm<DonanteForm>({
    resolver: zodResolver(donanteSchema),
    defaultValues: {
      nombre: "",
      apellido: "",
      cedula: "",
      telefono: "",
      email: "",
      tipoSangre: "",
      barrioId: "",
    },
  });

  // Verificar autorización al cargar la página
  useEffect(() => {
    // Siempre pedir contraseña, no importa si viene en la URL
    setIsAuthorized(false);
  }, []);

  // Cargar barrios solo si está autorizado
  useEffect(() => {
    if (isAuthorized) {
      fetch("/api/barrios")
        .then((res) => res.json())
        .then((data) => setBarrios(data))
        .catch((error) => console.error("Error loading barrios:", error));
    }
  }, [isAuthorized]);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthorized(true);
    } else {
      setMessage({ type: "error", text: "Contraseña incorrecta" });
    }
  };

  const onSubmit = async (data: DonanteForm) => {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/donantes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setMessage({ type: "success", text: "¡Donante registrado exitosamente!" });
        form.reset();
        
        // Redirigir al listado después de 2 segundos
        setTimeout(() => {
          router.push("/registro");
        }, 2000);
      } else {
        const error = await response.json();
        setMessage({ type: "error", text: error.error || "Error al registrar donante" });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Error de conexión" });
    } finally {
      setIsLoading(false);
    }
  };

  // Si no está autorizado, mostrar pantalla de login
  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Lock className="h-12 w-12 text-red-600" />
            </div>
            <CardTitle className="text-2xl">Acceso Administrativo</CardTitle>
            <CardDescription>
              Ingresa la contraseña para registrar un nuevo donante
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
              
              {message && (
                <div className={`flex items-center gap-2 p-3 rounded-md ${
                  message.type === "error" 
                    ? "bg-red-50 text-red-700 border border-red-200" 
                    : "bg-green-50 text-green-700 border border-green-200"
                }`}>
                  <AlertCircle className="h-4 w-4" />
                  {message.text}
                </div>
              )}

              <Button type="submit" className="w-full">
                Acceder
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Button variant="outline" asChild>
                <a href="/registro">Volver al Listado</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Si está autorizado, mostrar el formulario
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Droplets className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Nuevo Donante
          </h1>
          <p className="text-gray-600">
            Por favor ingresa todos los datos para registrar al donante.
          </p>
        </div>

        {/* Botón para volver */}
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/registro")} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver al Listado
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Información del Donante</CardTitle>
            <CardDescription>
              Completa todos los campos requeridos para registrar al donante
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre *</FormLabel>
                        <FormControl>
                          <Input placeholder="Juan" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="apellido"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Apellido *</FormLabel>
                        <FormControl>
                          <Input placeholder="Pérez" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="cedula"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>DUI *</FormLabel>
                      <FormControl>
                        <Input placeholder="00000000-0" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono</FormLabel>
                        <FormControl>
                          <Input placeholder="7777-7777" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="juan@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tipoSangre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Sangre *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu tipo de sangre" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {tiposSangre.map((tipo) => (
                              <SelectItem key={tipo} value={tipo}>
                                {tipo}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="barrioId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barrio *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu barrio" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {barrios.map((barrio) => (
                              <SelectItem key={barrio.id} value={barrio.id}>
                                {barrio.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {message && (
                  <div className={`flex items-center gap-2 p-4 rounded-md ${
                    message.type === "success" 
                      ? "bg-green-50 text-green-700 border border-green-200" 
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}>
                    {message.type === "success" ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <AlertCircle className="h-5 w-5" />
                    )}
                    {message.text}
                    {message.type === "success" && (
                      <span className="ml-2 text-sm">Regresando al listado...</span>
                    )}
                  </div>
                )}

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Registrando..." : "Registrar Donante"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 