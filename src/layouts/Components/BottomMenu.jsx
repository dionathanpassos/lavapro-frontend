import {
  CarFront,
  Ellipsis,
  FileText,
  House,
  Users,
  Settings,
  LogOut,
  ShieldAlert,
  ChartColumnIncreasing,
  LayoutDashboard,
  ShoppingCart,
  HandCoins,
  ArrowDownUp,
  ChartPie,
  UserPen,
} from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { useState, useRef, useEffect } from "react";
import { ROLES } from "../../Auth/roles";
import { getAuthenticatedUser } from "../../Auth/auth";

export default function BottonMenu() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  const authUser = getAuthenticatedUser();

  // Fecha o menu flutuante caso o usuário clique fora dele
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/auth/login");
  };

  const menus = [
    {
      name: "Início",
      path: "/start",
      end: true,
      icon: <House className="w-5 h-5" />,
      roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE],
    },
    {
      name: "Ordens",
      path: "/ordens-servico",
      icon: <FileText className="w-5 h-5" />,
      roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE],
    },
    {
      name: "Clientes",
      path: "/clientes",
      icon: <Users className="w-5 h-5" />,
      roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE],
    },
    {
      name: "Veículos",
      path: "/veiculos",
      icon: <CarFront className="w-5 h-5" />,
      roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE],
    },
  ];
  const extraMenus = [
    {
      name: "Dashboard",
      path: "/dashboard",
      end: true,
      icon: <LayoutDashboard className="w-5 h-5 shrink-0" />,
      roles: [ROLES.OWNER, ROLES.MANAGER],
    },
    {
      name: "Serviços/Produtos",
      path: "/produtos",
      icon: <ShoppingCart className="w-5 h-5 shrink-0" />,
      roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN],
    },
    {
      name: "Pagamentos",
      path: "/pagamentos",
      icon: <HandCoins className="w-5 h-5 shrink-0" />,
      roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE],
    },
    {
      name: "Fluxo de Caixa",
      path: "/fluxo-caixa",
      icon: <ArrowDownUp className="w-5 h-5 shrink-0" />,
      roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN],
    },
    {
      name: "Usuários",
      path: "/usuarios",
      icon: <Users className="w-5 h-5 shrink-0" />,
      roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN],
    },
    {
      name: "Relatórios",
      path: "/relatorios",
      icon: <ChartPie className="w-5 h-5 shrink-0" />,
      roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN],
    },
    {
      name: "Perfil",
      path: "/usuarios/profile",
      icon: <UserPen className="w-4 h-4 shrink-0" />,
      roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE],
    },
    {
      name: "Sair",
      onClick: handleLogout,
      icon: <LogOut className="w-4 h-4 text-destructive" />,
      roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE],
    },
  ];

  const visibleMenus = menus.filter((menu) =>
    menu.roles.includes(authUser?.role),
  );
  const visibleExtraMenus = extraMenus.filter((menu) =>
    menu.roles.includes(authUser?.role),
  );

  return (
    <footer
      ref={menuRef}
      className="relative h-16 w-full bg-background-white border-t border-border/50 py-1 z-50"
    >
      {isMenuOpen && (
        <div className="absolute bottom-20 right-4 bg-white border border-border/60 shadow-xl rounded-xl p-2 w-48 flex flex-col gap-1 animate-in fade-in slide-in-from-bottom-3 duration-200">
          {visibleExtraMenus.map((extra) => {
            if (extra.onClick) {
              return (
                <button
                  key={extra.name}
                  onClick={() => {
                    setIsMenuOpen(false);
                    extra.onClick();
                  }}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors text-left w-full"
                >
                  {extra.icon}
                  <span>{extra.name}</span>
                </button>
              );
            }

            return (
              <NavLink
                key={extra.path}
                to={extra.path}
                onClick={() => setIsMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                   ${isActive ? "bg-primary/10 text-primary" : "text-foreground hover:bg-zinc-100"}`
                }
              >
                {extra.icon}
                <span>{extra.name}</span>
              </NavLink>
            );
          })}
        </div>
      )}

      {/* BARRA PRINCIPAL */}
      <nav className="flex justify-between px-2">
        {visibleMenus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            end={menu.end}
            onClick={() => setIsMenuOpen(false)} // Fecha o menu flutuante se clicar em outra aba
            className={({ isActive }) =>
              `flex flex-col gap-1 items-center text-[11px] font-medium hover:bg-sidebar-hover px-3 py-1.5 rounded-md tracking-wider transition-colors  
              ${isActive ? "text-primary" : "text-muted-foreground"}`
            }
          >
            {menu.icon}
            <span>{menu.name}</span>
          </NavLink>
        ))}

        {/* BOTÃO "MAIS" INTERATIVO */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`flex flex-col gap-1 items-center text-[11px] font-medium px-3 py-1.5 rounded-md tracking-wider transition-colors
          ${isMenuOpen ? "text-primary bg-primary/5" : "text-muted-foreground"}`}
        >
          <Ellipsis
            className={`w-5 h-5 transition-transform duration-200 ${isMenuOpen ? "rotate-90 text-primary" : ""}`}
          />
          <span>Mais</span>
        </button>
      </nav>
    </footer>
  );
}
