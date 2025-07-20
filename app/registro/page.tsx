"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Droplets, Plus, Search, Calendar, Mail, Users, MapPin, Trash2, CheckCircle, AlertCircle } from "lucide-react";

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

export default function RegistroPage() {
  const [donantes, setDonantes] = useState<Donante[]>([]);
  const [donantesFiltrados, setDonantesFiltrados] = useState<Donante[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [donanteToDelete, setDonanteToDelete] = useState<Donante | null>(null);
  const [deletePassword, setDeletePassword] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Contraseña para eliminar donantes
  const DELETE_PASSWORD = process.env.NEXT_PUBLIC_DELETE_PASSWORD;

  useEffect(() => {
    cargarDonantes();
  }, []);

  useEffect(() => {
    // Filtrar donantes cuando cambia la búsqueda
    if (busqueda.trim() === "") {
      setDonantesFiltrados(donantes);
    } else {
      const filtrados = donantes.filter((donante) =>
        donante.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        donante.apellido.toLowerCase().includes(busqueda.toLowerCase()) ||
        donante.barrio.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
        donante.tipoSangre.toLowerCase().includes(busqueda.toLowerCase())
      );
      setDonantesFiltrados(filtrados);
    }
  }, [busqueda, donantes]);

  const cargarDonantes = async () => {
    try {
      const response = await fetch("/api/donantes");
      const data = await response.json();
      setDonantes(data);
      setDonantesFiltrados(data);
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

  const handleDeleteClick = (donante: Donante) => {
    setDonanteToDelete(donante);
    setShowDeleteModal(true);
    setDeletePassword("");
    setDeleteMessage(null);
  };

  const handleDeleteConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (deletePassword !== DELETE_PASSWORD) {
      setDeleteMessage({ type: "error", text: "Contraseña incorrecta" });
      return;
    }

    if (!donanteToDelete) return;

    setIsDeleting(true);
    setDeleteMessage(null);

    try {
      const response = await fetch(`/api/donantes/${donanteToDelete.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteMessage({ type: "success", text: "Donante eliminado exitosamente" });
        
        // Recargar la lista de donantes
        setTimeout(() => {
          cargarDonantes();
          setShowDeleteModal(false);
          setDonanteToDelete(null);
          setDeletePassword("");
          setDeleteMessage(null);
        }, 1500);
      } else {
        const error = await response.json();
        setDeleteMessage({ type: "error", text: error.error || "Error al eliminar donante" });
      }
    } catch (error) {
      setDeleteMessage({ type: "error", text: "Error de conexión" });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setDonanteToDelete(null);
    setDeletePassword("");
    setDeleteMessage(null);
  };

  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Droplets className="h-12 w-12 text-red-600 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Cargando donantes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-red-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Droplets className="h-12 w-12 text-red-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Listado de Donantes
          </h1>
          <p className="text-gray-600">
            Gestión y registro de donantes de sangre
          </p>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Total Donantes</p>
                  <p className="text-3xl font-bold text-red-600">{donantes.length}</p>
                </div>
                <Users className="h-10 w-10 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Mostrando</p>
                  <p className="text-3xl font-bold text-blue-600">{donantesFiltrados.length}</p>
                </div>
                <Search className="h-10 w-10 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600">Barrios</p>
                  <p className="text-3xl font-bold text-green-600">
                    {new Set(donantes.map(d => d.barrio.nombre)).size}
                  </p>
                </div>
                <MapPin className="h-10 w-10 text-green-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controles */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Buscar por nombre, barrio o tipo de sangre..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Button asChild className="flex items-center gap-2">
                <a href="/registro/nuevo">
                  <Plus className="h-4 w-4" />
                  Nuevo Donante
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabla de donantes */}
        <Card>
          <CardContent className="p-0">
            {donantesFiltrados.length === 0 ? (
              <div className="p-12 text-center">
                <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-500 mb-2">
                  {busqueda ? "No se encontraron donantes" : "No hay donantes registrados"}
                </h3>
                <p className="text-gray-400 mb-6">
                  {busqueda 
                    ? "Intenta con otros términos de búsqueda" 
                    : "Comienza agregando el primer donante"
                  }
                </p>
                {!busqueda && (
                  <Button asChild>
                    <a href="/registro/nuevo">
                      <Plus className="h-4 w-4 mr-2" />
                      Registrar Primer Donante
                    </a>
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-center p-4 font-semibold text-gray-900">#</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Nombre Completo</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Email</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Barrio</th>
                      <th className="text-center p-4 font-semibold text-gray-900">Tipo de Sangre</th>
                      <th className="text-left p-4 font-semibold text-gray-900">Fecha de Donación</th>
                      <th className="text-center p-4 font-semibold text-gray-900">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {donantesFiltrados.map((donante, index) => (
                      <tr 
                        key={donante.id} 
                        className={`border-b hover:bg-gray-50 transition-colors ${
                          index % 2 === 0 ? "bg-white" : "bg-gray-25"
                        }`}
                      >
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center w-8 h-8 bg-gray-100 text-gray-700 font-semibold rounded-full text-sm">
                            {index + 1}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-medium text-gray-900">
                            {donante.nombre} {donante.apellido}
                          </div>
                        </td>
                        <td className="p-4">
                          {donante.email ? (
                            <div className="flex items-center gap-2 text-gray-700">
                              <Mail className="h-4 w-4 text-gray-400" />
                              <span className="text-sm">{donante.email}</span>
                            </div>
                          ) : (
                            <span className="text-gray-400 text-sm">No registrado</span>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-gray-700">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            {donante.barrio.nombre}
                          </div>
                        </td>
                        <td className="p-4 text-center">
                          <span className="inline-flex items-center justify-center w-10 h-10 bg-red-100 text-red-600 font-bold rounded-full">
                            {donante.tipoSangre}
                          </span>
                        </td>
                                                 <td className="p-4">
                           <div className="flex items-center gap-2 text-gray-700">
                             <Calendar className="h-4 w-4 text-gray-400" />
                             {formatearFecha(donante.fechaDonacion)}
                           </div>
                         </td>
                         <td className="p-4 text-center">
                           <Button
                             variant="outline"
                             size="sm"
                             onClick={() => handleDeleteClick(donante)}
                             className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                           >
                             <Trash2 className="h-4 w-4" />
                           </Button>
                         </td>
                       </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Navegación y Estadísticas */}
        <div className="text-center mt-8">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button variant="outline" asChild>
              <a href="/admin">Ver Dashboard Administrativo</a>
            </Button>
            <p className="text-sm text-gray-500">
              Total: {donantesFiltrados.length} de {donantes.length} donantes
            </p>
          </div>
        </div>

        {/* Modal de confirmación de eliminación */}
        {showDeleteModal && donanteToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-red-600 flex items-center gap-2">
                  <Trash2 className="h-5 w-5" />
                  Eliminar Donante
                </CardTitle>
                <CardDescription>
                  ¿Estás seguro de que quieres eliminar a {donanteToDelete.nombre} {donanteToDelete.apellido}?
                  Esta acción no se puede deshacer.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleDeleteConfirm} className="space-y-4">
                  <div>
                    <Label htmlFor="deletePassword">Contraseña de confirmación</Label>
                    <Input
                      id="deletePassword"
                      type="password"
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Ingresa la contraseña para confirmar"
                      required
                    />
                  </div>
                  
                  {deleteMessage && (
                    <div className={`flex items-center gap-2 p-3 rounded-md ${
                      deleteMessage.type === "error" 
                        ? "bg-red-50 text-red-700 border border-red-200" 
                        : "bg-green-50 text-green-700 border border-green-200"
                    }`}>
                      {deleteMessage.type === "success" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      {deleteMessage.text}
                    </div>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleDeleteCancel}
                      disabled={isDeleting}
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      variant="destructive"
                      disabled={isDeleting}
                      className="flex-1"
                    >
                      {isDeleting ? "Eliminando..." : "Eliminar"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 