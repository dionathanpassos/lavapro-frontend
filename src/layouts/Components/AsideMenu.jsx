import { 
  ArrowDownUp, CarFront, ChevronUp, FileText, HandCoins, 
  LayoutDashboard, LogOut, ShoppingCart, User, UserPen, 
  UserRound, Users, ChevronLeft, ChevronRight, 
  ChartPie,
  Zap
} from "lucide-react";
import { useCallback, useEffect, useState, useRef } from "react";
import { NavLink, useNavigate } from "react-router";
import { getProfileUser } from "../../services/userService";
import { getAuthenticatedUser } from "../../Auth/auth";
import { ROLES } from "../../Auth/roles";

export default function AsideMenu() {
  const authUser = getAuthenticatedUser();
  
  const menus = [
    { name: "Dashboard", path: "/dashboard", end: true, icon: <LayoutDashboard className="w-5 h-5 shrink-0" />, roles: [ROLES.OWNER, ROLES.MANAGER] },
    { name: "Resumo", path: "/start", end: true, icon: <Zap className="w-5 h-5 shrink-0" />, roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE] },
    { name: "Orderns de Serviço", path: "/ordens-servico", icon: <FileText className="w-5 h-5 shrink-0" />, roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE] },
    { name: "Clientes", path: "/clientes", icon: <UserRound className="w-5 h-5 shrink-0" />, roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE] },
    { name: "Veículos", path: "/veiculos", icon: <CarFront className="w-5 h-5 shrink-0" />, roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE] },
    { name: "Serviços/Produtos", path: "/produtos", icon: <ShoppingCart className="w-5 h-5 shrink-0" />, roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN] },
    { name: "Pagamentos", path: "/pagamentos", icon: <HandCoins className="w-5 h-5 shrink-0" />, roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN, ROLES.EMPLOYEE] },
    { name: "Fluxo de Caixa", path: "/fluxo-caixa", icon: <ArrowDownUp className="w-5 h-5 shrink-0" />, roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN] },
    { name: "Usuários", path: "/usuarios", icon: <Users className="w-5 h-5 shrink-0" />, roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN] },
    { name: "Relatórios", path: "/relatorios", icon: <ChartPie className="w-5 h-5 shrink-0"/>, roles: [ROLES.OWNER, ROLES.MANAGER, ROLES.ADMIN]  },
  ];

  const visibleMenus = menus.filter(menu => 
    menu.roles.includes(authUser?.role)
  );

  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false); 
  const [user, setUser] = useState({});
  
  const dropdownRef = useRef(null);

  const loadProfile = useCallback(async () => {
    try {
      const profileResponse = await getProfileUser();
      setUser(profileResponse || {});
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadProfile();
  }, [loadProfile]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    navigate("/auth/login");
  };

  const handleProfile = () => {
    setShowDropdown(false);
    navigate("/usuarios/profile");
  };

  return (
    <aside 
      className={`hidden md:flex flex-col bg-sidebar-background text-foreground-secondary 
        px-3 py-4 border-r border-border/20 transition-all duration-300 relative h-screen 
        ${isCollapsed ? "w-20" : "w-64"}`}
    >
 
      <div className={`flex items-center mb-6 pt-2 pb-4 border-b border-border/10 min-h-12.5
        ${isCollapsed ? "justify-center" : "justify-between px-2"}`}>
        
        {!isCollapsed && (
          <div className="flex items-center gap-2 animate-in fade-in duration-200">       
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-foreground-secondary shadow-sm">
              LP
            </div>
            <span className="font-bold text-lg tracking-wider text-foreground-secondary">LavaPro</span>
          </div>
        )}
        
        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center font-bold text-foreground-secondary shadow-sm animate-in zoom-in-75 duration-200">
            LP
          </div>
        )}

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3 top-7 bg-white text-gray-700 border border-gray-200 p-1 rounded-full shadow-md hover:bg-gray-50 transition-colors z-50 focus:outline-none"
        >
          {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
        </button>
      </div>


      <nav className="flex flex-col gap-2 font-light w-full flex-1 overflow-y-auto">
        {visibleMenus.map((menu) => (
          <NavLink
            key={menu.path}
            to={menu.path}
            end={menu.end}
            title={isCollapsed ? menu.name : ""}
            className={({ isActive }) =>
              `flex gap-3 items-center text-sm  px-4 py-2.5 rounded-md tracking-wide transition-all group
              ${isActive ? "bg-primary font-medium hover:bg-primary-hover" : "hover:bg-sidebar-hover"}
              ${isCollapsed ? "justify-center px-0 w-12 mx-auto" : ""}`
            }
          >
            {menu.icon}
            {!isCollapsed && (
              <span className="animate-in fade-in slide-in-from-left-2 duration-200 truncate">
                {menu.name}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

        <div ref={dropdownRef} className="mt-auto pt-4 border-t border-border/10 relative w-full">
          {showDropdown && (
            <div className={`absolute bottom-16 bg-background-white border border-border shadow-xl rounded-lg p-1 flex flex-col z-50 animate-in fade-in slide-in-from-bottom-2 duration-200
              ${isCollapsed ? "left-2 w-48" : "left-0 w-full"}`}>
              <button
                onClick={handleProfile}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-primary hover:bg-primary/5 rounded-md transition-colors font-medium text-left"
              >
                <UserPen className="w-4 h-4" />
                Perfil
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 rounded-md transition-colors font-medium text-left"
              >
                <LogOut className="w-4 h-4" />
                Sair do sistema
              </button>
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowDropdown(!showDropdown)}
            className={`flex items-center justify-between w-full p-1 rounded-xl transition-all duration-200 text-left
              ${showDropdown ? "bg-sidebar-hover" : "hover:bg-sidebar-hover"}
              ${isCollapsed ? "justify-center p-1" : ""}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <span className="flex bg-status-progress-bg text-status-progress items-center justify-center w-9 h-9 rounded-full border border-border shrink-0">
                <User />
              </span>

              {!isCollapsed && (
                <div className="flex flex-col leading-tight truncate animate-in fade-in duration-200">
                  <span className="text-sm font-semibold text-foreground-secondary truncate">{user.name || "Usuário"}</span>
                  <span className="text-xs text-muted-foreground truncate">{getUserRole(user.role)}</span>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <ChevronUp className={`w-4 h-4 text-muted-foreground transition-transform duration-200 shrink-0 ${showDropdown ? "rotate-180" : ""}`} />
            )}
          </button>
        </div>
    </aside>
  );
}

const getUserRole = (role) => {
  if (role === "ROLE_OWNER") return "Proprietário";
  if (role === "ROLE_ADMIN") return "Administrador";
  if (role === "ROLE_EMPLOYEE") return "Atendente";
  return role;
};
