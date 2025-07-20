import { Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="py-4 px-4 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto text-center">
        <p className="text-sm text-gray-400">
          Creado por{" "}
          <span className="font-medium text-white">Paul Cabeza</span>
          {" "}(
          <a 
            href="mailto:paulcabezadev@gmail.com" 
            className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
          >
            <Mail className="h-3 w-3" />
            paulcabezadev@gmail.com
          </a>
          )
        </p>
      </div>
    </footer>
  );
} 