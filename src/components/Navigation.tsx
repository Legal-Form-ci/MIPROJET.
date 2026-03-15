import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, User, LogOut, LayoutDashboard, ChevronDown } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo-miprojet-new.png";

export const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openMobileSub, setOpenMobileSub] = useState<string | null>(null);
  const { t } = useLanguage();
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = () => {
    const email = user?.email || '';
    return email.charAt(0).toUpperCase();
  };

  const toggleMobileSub = (key: string) => {
    setOpenMobileSub(prev => prev === key ? null : key);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <img src={logo} alt="MIPROJET logo" className="h-10 w-auto max-w-[120px] object-contain rounded-lg" />
            <span className="font-bold text-xl text-foreground hidden sm:inline">MIPROJET</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <NavigationMenu>
              <NavigationMenuList className="gap-0">
                <NavigationMenuItem>
                  <Link to="/" className="text-foreground hover:text-primary transition-colors text-sm px-2.5 py-2">
                    {t('nav.home')}
                  </Link>
                </NavigationMenuItem>

                {/* Projets & Services */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm bg-transparent h-9 px-2.5">Projets</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[280px] gap-1 p-2">
                      <li><NavigationMenuLink asChild><Link to="/projects" className="block p-2 rounded-md hover:bg-muted text-sm">{t('nav.projects')}</Link></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><Link to="/submit-project" className="block p-2 rounded-md hover:bg-muted text-sm">{t('nav.submitProject')}</Link></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><Link to="/how-it-works" className="block p-2 rounded-md hover:bg-muted text-sm">{t('nav.howItWorks')}</Link></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><Link to="/incubation" className="block p-2 rounded-md hover:bg-muted text-sm">🚀 Programme d'Incubation</Link></NavigationMenuLink></li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Services */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm bg-transparent h-9 px-2.5">Services</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[280px] gap-1 p-2">
                      <li><NavigationMenuLink asChild><Link to="/services" className="block p-2 rounded-md hover:bg-muted text-sm">{t('nav.services')}</Link></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><Link to="/services/structuration" className="block p-2 rounded-md hover:bg-muted text-sm">📋 Structuration de projets</Link></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><Link to="/services/accompagnement" className="block p-2 rounded-md hover:bg-muted text-sm">🤝 Accompagnement entreprise</Link></NavigationMenuLink></li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Investir */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm bg-transparent text-primary font-medium h-9 px-2.5">Investir</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[280px] gap-1 p-2">
                      <li><NavigationMenuLink asChild><Link to="/investors" className="block p-2 rounded-md hover:bg-muted text-sm">💼 Espace Investisseurs</Link></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><Link to="/opportunities" className="block p-2 rounded-md hover:bg-muted text-sm">🎯 Opportunités</Link></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><Link to="/ebook" className="block p-2 rounded-md hover:bg-muted text-sm">📕 Guide : 50 Opportunités</Link></NavigationMenuLink></li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Ressources */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-sm bg-transparent h-9 px-2.5">Ressources</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <ul className="grid w-[280px] gap-1 p-2">
                      <li><NavigationMenuLink asChild><Link to="/documents" className="block p-2 rounded-md hover:bg-muted text-sm">📚 Documents & Guides</Link></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><Link to="/news" className="block p-2 rounded-md hover:bg-muted text-sm">📰 Actualités</Link></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><Link to="/blog" className="block p-2 rounded-md hover:bg-muted text-sm">📝 Blog</Link></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><Link to="/forum" className="block p-2 rounded-md hover:bg-muted text-sm">💬 Forum</Link></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><Link to="/success-stories" className="block p-2 rounded-md hover:bg-muted text-sm">🏆 Témoignages</Link></NavigationMenuLink></li>
                      <li><NavigationMenuLink asChild><Link to="/faq" className="block p-2 rounded-md hover:bg-muted text-sm">❓ FAQ</Link></NavigationMenuLink></li>
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/subscription" className="text-accent font-medium hover:text-accent/80 transition-colors text-sm px-2.5 py-2 flex items-center gap-1">
                    <span className="text-xs">👑</span> Abonnement
                  </Link>
                </NavigationMenuItem>

                <NavigationMenuItem>
                  <Link to="/about" className="text-foreground hover:text-primary transition-colors text-sm px-2.5 py-2">
                    {t('nav.about')}
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          <div className="hidden lg:flex items-center space-x-2">
            <LanguageSelector />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback className="bg-primary text-primary-foreground">{getInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-primary/10 text-primary text-sm">{getInitials()}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <p className="text-sm font-medium truncate">{user.email}</p>
                      <p className="text-xs text-muted-foreground">{isAdmin ? 'Administrateur' : 'Membre'}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {t('nav.dashboard')}
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        {t('nav.admin')}
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/auth">
                <Button variant="ghost" size="sm">{t('nav.login')}</Button>
              </Link>
            )}
            
            <Link to="/submit-project">
              <Button variant="default" size="sm">{t('nav.submitProject')}</Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSelector />
            <button className="text-foreground p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden py-4 space-y-1 border-t border-border max-h-[70vh] overflow-y-auto">
            <Link to="/" className="block text-foreground hover:text-primary transition-colors py-2 px-2" onClick={() => setIsMenuOpen(false)}>
              {t('nav.home')}
            </Link>

            {/* Projets */}
            <button onClick={() => toggleMobileSub('projects')} className="w-full flex items-center justify-between py-2 px-2 text-foreground hover:text-primary">
              <span>Projets</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", openMobileSub === 'projects' && "rotate-180")} />
            </button>
            {openMobileSub === 'projects' && (
              <div className="pl-4 space-y-1 border-l-2 border-primary/20 ml-2">
                <Link to="/projects" className="block py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>{t('nav.projects')}</Link>
                <Link to="/submit-project" className="block py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>{t('nav.submitProject')}</Link>
                <Link to="/how-it-works" className="block py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>{t('nav.howItWorks')}</Link>
                <Link to="/incubation" className="block py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>🚀 Programme d'Incubation</Link>
              </div>
            )}

            {/* Services */}
            <button onClick={() => toggleMobileSub('services')} className="w-full flex items-center justify-between py-2 px-2 text-foreground hover:text-primary">
              <span>Services</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", openMobileSub === 'services' && "rotate-180")} />
            </button>
            {openMobileSub === 'services' && (
              <div className="pl-4 space-y-1 border-l-2 border-primary/20 ml-2">
                <Link to="/services" className="block py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>{t('nav.services')}</Link>
                <Link to="/services/structuration" className="block py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>📋 Structuration</Link>
                <Link to="/services/accompagnement" className="block py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>🤝 Accompagnement</Link>
              </div>
            )}

            {/* Investir */}
            <button onClick={() => toggleMobileSub('invest')} className="w-full flex items-center justify-between py-2 px-2 text-primary font-medium">
              <span>Investir</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", openMobileSub === 'invest' && "rotate-180")} />
            </button>
            {openMobileSub === 'invest' && (
              <div className="pl-4 space-y-1 border-l-2 border-primary/20 ml-2">
                <Link to="/investors" className="block py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>💼 Espace Investisseurs</Link>
                <Link to="/opportunities" className="block py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>🎯 Opportunités</Link>
                <Link to="/ebook" className="block py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>📕 Guide : 50 Opportunités</Link>
              </div>
            )}

            {/* Ressources */}
            <button onClick={() => toggleMobileSub('resources')} className="w-full flex items-center justify-between py-2 px-2 text-foreground hover:text-primary">
              <span>Ressources</span>
              <ChevronDown className={cn("h-4 w-4 transition-transform", openMobileSub === 'resources' && "rotate-180")} />
            </button>
            {openMobileSub === 'resources' && (
              <div className="pl-4 space-y-1 border-l-2 border-primary/20 ml-2">
                <Link to="/documents" className="block py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>📚 Documents</Link>
                <Link to="/news" className="block py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>📰 Actualités</Link>
                <Link to="/blog" className="block py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>📝 Blog</Link>
                <Link to="/forum" className="block py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>💬 Forum</Link>
                <Link to="/success-stories" className="block py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>🏆 Témoignages</Link>
                <Link to="/faq" className="block py-1.5 px-2 text-sm text-muted-foreground hover:text-foreground" onClick={() => setIsMenuOpen(false)}>❓ FAQ</Link>
              </div>
            )}

            <Link to="/subscription" className="block text-accent font-medium hover:text-accent/80 py-2 px-2" onClick={() => setIsMenuOpen(false)}>
              👑 Abonnement
            </Link>
            <Link to="/about" className="block text-foreground hover:text-primary py-2 px-2" onClick={() => setIsMenuOpen(false)}>
              {t('nav.about')}
            </Link>
            <Link to="/contact" className="block text-foreground hover:text-primary py-2 px-2" onClick={() => setIsMenuOpen(false)}>
              {t('nav.contact')}
            </Link>
            
            <div className="space-y-2 pt-4 border-t border-border">
              {user ? (
                <>
                  <Link to="/dashboard" onClick={() => setIsMenuOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      {t('nav.dashboard')}
                    </Button>
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)}>
                      <Button variant="ghost" className="w-full justify-start">
                        <User className="mr-2 h-4 w-4" />
                        {t('nav.admin')}
                      </Button>
                    </Link>
                  )}
                  <Button variant="ghost" className="w-full justify-start text-destructive" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="ghost" className="w-full">{t('nav.login')}</Button>
                </Link>
              )}
              <Link to="/submit-project" onClick={() => setIsMenuOpen(false)}>
                <Button variant="default" className="w-full">{t('nav.submitProject')}</Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
