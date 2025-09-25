import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { Button } from './components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './components/ui/alert-dialog';
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./hooks/use-toast";
import { 
  Dumbbell, 
  Apple, 
  Brain, 
  Star, 
  Trophy, 
  Zap, 
  Activity,
  User,
  LogOut,
  History,
  CreditCard,
  Crown,
  Eye,
  Trash2,
  Calendar,
  AlertTriangle,
  UserMinus
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Auth Context
const AuthContext = React.createContext();

const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get(`${API}/user/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem('token', userToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Landing Page Component
const LandingPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-lg border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="fitlife-logo">
            <div className="fitlife-logo-text">FitLife AI</div>
          </div>
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              className="text-white hover:bg-white/10"
              onClick={() => navigate('/auth')}
            >
              Login
            </Button>
            <Button 
              className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:opacity-90 text-white font-semibold"
              onClick={() => navigate('/auth')}
            >
              Comece Grátis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.7)), url('https://customer-assets.emergentagent.com/job_smartfit-ai-2/artifacts/0b9ap7fs_f7736199-989a-4bc2-ad40-54f184078b7a.png')`
          }}
        />
        
        <div className="relative container mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
            Seu Personal Trainer
            <span className="block bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent">
              com Inteligência Artificial
            </span>
          </h1>
          
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Sugestões personalizadas de treinos e nutrição criadas especialmente para você.
            7 dias grátis, depois apenas R$ 14,90/mês.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:opacity-90 text-white font-semibold px-8 py-4 text-lg"
              onClick={() => navigate('/auth')}
            >
              <Zap className="mr-2 h-5 w-5" />
              Começar Agora - Grátis
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-slate-900 px-8 py-4 text-lg"
            >
              Ver Como Funciona
            </Button>
          </div>
          
          <div className="mt-12 flex justify-center items-center space-x-8 text-sm text-gray-400">
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-1" />
              7 dias grátis
            </div>
            <div className="flex items-center">
              <Crown className="h-4 w-4 text-orange-500 mr-1" />
              IA Personalizada
            </div>
            <div className="flex items-center">
              <Activity className="h-4 w-4 text-pink-500 mr-1" />
              Sugestões Ilimitadas
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-slate-800/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-6">
              Tecnologia que Transforma seu
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 bg-clip-text text-transparent"> Fitness</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Nossa IA analisa seus dados pessoais para criar sugestões únicas de treino e nutrição
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-900/80 border-slate-700 backdrop-blur-sm hover:border-orange-500/50 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
                  <Dumbbell className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Treinos Personalizados</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center text-lg">
                  IA cria treinos específicos baseados em sua idade, peso, altura e objetivos pessoais
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-slate-700 backdrop-blur-sm hover:border-pink-500/50 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-pink-500 to-red-500 rounded-full flex items-center justify-center mb-4">
                  <Apple className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">Nutrição Inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center text-lg">
                  Sugestões de dieta balanceada com porções e horários ideais para seus objetivos
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/80 border-slate-700 backdrop-blur-sm hover:border-red-500/50 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-gradient-to-r from-red-500 to-orange-500 rounded-full flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl text-white">IA Avançada</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-300 text-center text-lg">
                  Powered by Gemini AI, a mais avançada tecnologia para sugestões fitness personalizadas
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-r from-orange-500 via-pink-500 to-red-500">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
            Pronto para Transformar seu Corpo?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de pessoas que já transformaram suas vidas com o FitLife AI
          </p>
          <Button 
            size="lg" 
            className="bg-white text-slate-900 hover:bg-gray-100 font-semibold px-12 py-4 text-xl"
            onClick={() => navigate('/auth')}
          >
            <Trophy className="mr-2 h-6 w-6" />
            Comece sua Transformação
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 px-6 border-t border-slate-800">
        <div className="container mx-auto text-center">
          <div className="fitlife-logo justify-center mb-4">
            <div className="fitlife-logo-text">FitLife AI</div>
          </div>
          <p className="text-gray-400">© 2025 FitLife AI. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

// Auth Forms Component
const AuthForms = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    age: '',
    weight: '',
    height: '',
    goals: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Validação de confirmação de senha apenas no cadastro
    if (!isLogin && formData.password !== formData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem. Verifique e tente novamente.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }

    try {
      const endpoint = isLogin ? 'login' : 'register';
      // Remover confirmPassword do objeto enviado para o backend
      const { confirmPassword, ...dataToSend } = formData;
      const response = await axios.post(`${API}/auth/${endpoint}`, dataToSend);
      
      login(response.data.user, response.data.token);
      toast({
        title: "Sucesso!",
        description: isLogin ? "Login realizado com sucesso!" : "Cadastro realizado com sucesso!"
      });
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Erro",
        description: error.response?.data?.detail || "Ocorreu um erro. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700">
        <CardHeader className="text-center">
          <div className="fitlife-logo mx-auto mb-2">
            <div className="fitlife-logo-text">FitLife AI</div>
          </div>
          <CardTitle className="text-white">
            {isLogin ? 'Entrar na sua conta' : 'Criar conta gratuita'}
          </CardTitle>
          <CardDescription className="text-gray-400">
            {isLogin ? 'Acesse suas sugestões personalizadas' : '7 dias grátis, depois R$ 14,90/mês'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white">Nome completo</Label>
                  <Input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="age" className="text-white">Idade</Label>
                    <Input
                      id="age"
                      type="number"
                      required
                      value={formData.age}
                      onChange={(e) => setFormData({...formData, age: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                  <div>
                    <Label htmlFor="weight" className="text-white">Peso (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      required
                      value={formData.weight}
                      onChange={(e) => setFormData({...formData, weight: e.target.value})}
                      className="bg-slate-700 border-slate-600 text-white"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="height" className="text-white">Altura (cm)</Label>
                  <Input
                    id="height"
                    type="number"
                    required
                    value={formData.height}
                    onChange={(e) => setFormData({...formData, height: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
                <div>
                  <Label htmlFor="goals" className="text-white">Seus objetivos</Label>
                  <Textarea
                    id="goals"
                    required
                    placeholder="Ex: Perder peso, ganhar massa muscular, melhorar condicionamento..."
                    value={formData.goals}
                    onChange={(e) => setFormData({...formData, goals: e.target.value})}
                    className="bg-slate-700 border-slate-600 text-white"
                  />
                </div>
              </div>
            )}
            
            <div>
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="password" className="text-white">Senha</Label>
              <Input
                id="password"
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                className="bg-slate-700 border-slate-600 text-white"
              />
            </div>

            {!isLogin && (
              <div>
                <Label htmlFor="confirmPassword" className="text-white">Confirmar Senha</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  className={`bg-slate-700 border-slate-600 text-white ${
                    formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword
                      ? 'border-red-500 focus:border-red-500' 
                      : formData.password && formData.confirmPassword && formData.password === formData.confirmPassword
                      ? 'border-green-500 focus:border-green-500'
                      : ''
                  }`}
                />
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="text-red-400 text-sm mt-1">As senhas não coincidem</p>
                )}
                {formData.password && formData.confirmPassword && formData.password === formData.confirmPassword && (
                  <p className="text-green-400 text-sm mt-1">✓ Senhas coincidem</p>
                )}
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:opacity-90 text-white font-semibold"
              disabled={loading || (!isLogin && formData.password !== formData.confirmPassword)}
            >
              {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Criar Conta Grátis')}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-orange-400 hover:text-orange-300 transition-colors"
            >
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Faça login'}
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Dashboard Component
const Dashboard = () => {
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [currentSuggestion, setCurrentSuggestion] = useState(null);
  const [suggestionType, setSuggestionType] = useState('workout');
  const [workoutHistory, setWorkoutHistory] = useState([]);
  const [nutritionHistory, setNutritionHistory] = useState([]);
  const [deleteAccountData, setDeleteAccountData] = useState({
    password: '',
    confirmationText: ''
  });
  const [isDeleting, setIsDeleting] = useState(false);

  const generateSuggestion = async (type) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API}/suggestions/${type}`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setCurrentSuggestion(response.data);
      setSuggestionType(type);
      
      toast({
        title: "Sugestão gerada!",
        description: `Nova sugestão de ${type === 'workout' ? 'treino' : 'nutrição'} criada com sucesso.`
      });
      
      // Refresh history
      if (type === 'workout') {
        fetchWorkoutHistory();
      } else {
        fetchNutritionHistory();
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast({
          title: "Trial expirado",
          description: "Faça upgrade para premium para continuar usando.",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Erro",
          description: "Não foi possível gerar a sugestão. Tente novamente.",
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchWorkoutHistory = async () => {
    try {
      const response = await axios.get(`${API}/history/workouts`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setWorkoutHistory(response.data);
    } catch (error) {
      console.error('Error fetching workout history:', error);
    }
  };

  const fetchNutritionHistory = async () => {
    try {
      const response = await axios.get(`${API}/history/nutrition`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setNutritionHistory(response.data);
    } catch (error) {
      console.error('Error fetching nutrition history:', error);
    }
  };

  const deleteSuggestion = async (id, type) => {
    try {
      await axios.delete(`${API}/history/${type}/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      toast({
        title: "Sugestão excluída!",
        description: `${type === 'workouts' ? 'Treino' : 'Dieta'} removida do histórico.`
      });
      
      // Refresh history
      if (type === 'workouts') {
        fetchWorkoutHistory();
      } else {
        fetchNutritionHistory();
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível excluir a sugestão.",
        variant: "destructive"
      });
    }
  };

  const handleUpgrade = async () => {
    try {
      const response = await axios.post(`${API}/payments/checkout`, {}, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.data.url) {
        window.location.href = response.data.url;
      }
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível iniciar o pagamento. Tente novamente.",
        variant: "destructive"
      });
    }
  };

  const handleDeleteAccount = async () => {
    if (!deleteAccountData.password || !deleteAccountData.confirmationText) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos para confirmar a exclusão.",
        variant: "destructive"
      });
      return;
    }

    if (deleteAccountData.confirmationText.toLowerCase() !== "excluir minha conta") {
      toast({
        title: "Erro",
        description: "Digite exatamente 'excluir minha conta' para confirmar.",
        variant: "destructive"
      });
      return;
    }

    setIsDeleting(true);

    try {
      const response = await axios.post(`${API}/user/delete-account`, {
        password: deleteAccountData.password,
        confirmation_text: deleteAccountData.confirmationText
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      toast({
        title: "Conta excluída",
        description: "Sua conta e todos os dados foram removidos permanentemente."
      });

      // Logout após exclusão bem-sucedida
      setTimeout(() => {
        logout();
        window.location.href = '/';
      }, 2000);

    } catch (error) {
      toast({
        title: "Erro na exclusão",
        description: error.response?.data?.detail || "Não foi possível excluir a conta. Verifique sua senha.",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchWorkoutHistory();
    fetchNutritionHistory();
  }, []);

  const isTrialActive = user && new Date() <= new Date(user.trial_end_date);
  const trialDaysLeft = user ? Math.max(0, Math.ceil((new Date(user.trial_end_date) - new Date()) / (1000 * 60 * 60 * 24))) : 0;

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="fitlife-logo">
            <div className="fitlife-logo-text">FitLife AI</div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-white">
              <span className="text-gray-400">Olá,</span> {user?.name}
            </div>
            {!user?.is_premium && (
              <div className="bg-yellow-600 text-black px-3 py-1 rounded-full text-sm font-semibold">
                {isTrialActive ? `${trialDaysLeft} dias restantes` : 'Trial expirado'}
              </div>
            )}
            {user?.is_premium && (
              <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                <Crown className="inline h-4 w-4 mr-1" />
                Premium
              </div>
            )}
            <Button variant="ghost" onClick={logout} className="text-white hover:bg-slate-700">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto p-6">
        <Tabs defaultValue="suggestions" className="space-y-6">
          <TabsList className="bg-slate-800 border-slate-700">
            <TabsTrigger value="suggestions" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
              <Zap className="mr-2 h-4 w-4" />
              Sugestões IA
            </TabsTrigger>
            <TabsTrigger value="history" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
              <History className="mr-2 h-4 w-4" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="profile" className="text-white data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-pink-500">
              <User className="mr-2 h-4 w-4" />
              Perfil
            </TabsTrigger>
          </TabsList>

          <TabsContent value="suggestions" className="space-y-6">
            {!user?.is_premium && !isTrialActive && (
              <Card className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 border-0">
                <CardContent className="p-6 text-center">
                  <Crown className="mx-auto h-12 w-12 text-white mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Trial Expirado</h3>
                  <p className="text-white/90 mb-4">
                    Faça upgrade para premium e continue aproveitando sugestões ilimitadas de treino e nutrição.
                  </p>
                  <Button 
                    onClick={handleUpgrade}
                    className="bg-white text-slate-900 hover:bg-gray-100 font-semibold"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    Upgrade Premium - R$ 14,90/mês
                  </Button>
                </CardContent>
              </Card>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Dumbbell className="mr-2 h-5 w-5 text-orange-500" />
                    Sugestão de Treino
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    IA personalizada baseada no seu perfil
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => generateSuggestion('workout')}
                    disabled={loading || (!user?.is_premium && !isTrialActive)}
                    className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:opacity-90 text-white"
                  >
                    {loading && suggestionType === 'workout' ? 'Gerando...' : 'Gerar Treino'}
                  </Button>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Apple className="mr-2 h-5 w-5 text-pink-500" />
                    Sugestão de Nutrição
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    Dieta balanceada para seus objetivos
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    onClick={() => generateSuggestion('nutrition')}
                    disabled={loading || (!user?.is_premium && !isTrialActive)}
                    className="w-full bg-gradient-to-r from-pink-500 to-red-500 hover:opacity-90 text-white"
                  >
                    {loading && suggestionType === 'nutrition' ? 'Gerando...' : 'Gerar Dieta'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {currentSuggestion && (
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    {suggestionType === 'workout' ? (
                      <Dumbbell className="mr-2 h-5 w-5 text-orange-500" />
                    ) : (
                      <Apple className="mr-2 h-5 w-5 text-pink-500" />
                    )}
                    {suggestionType === 'workout' ? 'Sua Sugestão de Treino' : 'Sua Sugestão de Nutrição'}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="suggestion-content">
                    <div className="ai-response whitespace-pre-wrap">
                      {currentSuggestion.suggestion}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Dumbbell className="mr-2 h-5 w-5 text-orange-500" />
                    Histórico de Treinos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {workoutHistory.length === 0 ? (
                    <p className="text-gray-400">Nenhum treino gerado ainda.</p>
                  ) : (
                    workoutHistory.map((workout) => (
                      <div key={workout.id} className="p-4 bg-slate-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-400 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(workout.created_at).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-orange-400 hover:text-orange-300 hover:bg-orange-400/10">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-slate-800 border-slate-700 max-w-3xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-white flex items-center">
                                    <Dumbbell className="mr-2 h-5 w-5 text-orange-500" />
                                    Sugestão de Treino
                                  </DialogTitle>
                                  <DialogDescription className="text-gray-400">
                                    Gerado em {new Date(workout.created_at).toLocaleString('pt-BR')}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4">
                                  <div className="suggestion-content">
                                    <div className="ai-response whitespace-pre-wrap">
                                      {workout.suggestion}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                              onClick={() => deleteSuggestion(workout.id, 'workouts')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-white text-sm line-clamp-2">
                          {workout.suggestion.substring(0, 120)}...
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Apple className="mr-2 h-5 w-5 text-pink-500" />
                    Histórico de Nutrição
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {nutritionHistory.length === 0 ? (
                    <p className="text-gray-400">Nenhuma dieta gerada ainda.</p>
                  ) : (
                    nutritionHistory.map((nutrition) => (
                      <div key={nutrition.id} className="p-4 bg-slate-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div className="text-sm text-gray-400 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {new Date(nutrition.created_at).toLocaleDateString('pt-BR')}
                          </div>
                          <div className="flex items-center space-x-2">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="ghost" className="text-pink-400 hover:text-pink-300 hover:bg-pink-400/10">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="bg-slate-800 border-slate-700 max-w-3xl max-h-[80vh] overflow-y-auto">
                                <DialogHeader>
                                  <DialogTitle className="text-white flex items-center">
                                    <Apple className="mr-2 h-5 w-5 text-pink-500" />
                                    Sugestão de Nutrição
                                  </DialogTitle>
                                  <DialogDescription className="text-gray-400">
                                    Gerado em {new Date(nutrition.created_at).toLocaleString('pt-BR')}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4">
                                  <div className="suggestion-content">
                                    <div className="ai-response whitespace-pre-wrap">
                                      {nutrition.suggestion}
                                    </div>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                              onClick={() => deleteSuggestion(nutrition.id, 'nutrition')}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div className="text-white text-sm line-clamp-2">
                          {nutrition.suggestion.substring(0, 120)}...
                        </div>
                      </div>
                    ))
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Informações Pessoais</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-400">Nome</Label>
                      <div className="text-white">{user?.name}</div>
                    </div>
                    <div>
                      <Label className="text-gray-400">Email</Label>
                      <div className="text-white">{user?.email}</div>
                    </div>
                    <div>
                      <Label className="text-gray-400">Idade</Label>
                      <div className="text-white">{user?.age} anos</div>
                    </div>
                    <div>
                      <Label className="text-gray-400">Peso</Label>
                      <div className="text-white">{user?.weight} kg</div>
                    </div>
                    <div>
                      <Label className="text-gray-400">Altura</Label>
                      <div className="text-white">{user?.height} cm</div>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-400">Objetivos</Label>
                    <div className="text-white">{user?.goals}</div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-800 border-slate-700">
                <CardHeader>
                  <CardTitle className="text-white">Status da Conta</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Plano</span>
                    <div className="flex items-center">
                      {user?.is_premium ? (
                        <div className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          <Crown className="inline h-4 w-4 mr-1" />
                          Premium
                        </div>
                      ) : (
                        <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          isTrialActive 
                            ? 'bg-yellow-600 text-black' 
                            : 'bg-red-600 text-white'
                        }`}>
                          {isTrialActive ? 'Trial Ativo' : 'Trial Expirado'}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {!user?.is_premium && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Trial termina em</span>
                        <span className="text-white">{trialDaysLeft} dias</span>
                      </div>
                      <Button 
                        onClick={handleUpgrade}
                        className="w-full bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:opacity-90 text-white"
                      >
                        <CreditCard className="mr-2 h-4 w-4" />
                        Upgrade Premium - R$ 14,90/mês
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Zona de Perigo - Exclusão de Conta */}
            <Card className="bg-red-900/20 border-red-500/50">
              <CardHeader>
                <CardTitle className="text-red-400 flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5" />
                  Zona de Perigo
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Ações irreversíveis que afetam sua conta permanentemente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
                    >
                      <UserMinus className="mr-2 h-4 w-4" />
                      Excluir Conta
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent className="bg-slate-800 border-slate-700">
                    <AlertDialogHeader>
                      <AlertDialogTitle className="text-red-400 flex items-center">
                        <AlertTriangle className="mr-2 h-5 w-5" />
                        Confirmar Exclusão da Conta
                      </AlertDialogTitle>
                      <AlertDialogDescription className="text-gray-300">
                        ⚠️ Esta ação é <strong>IRREVERSÍVEL</strong> e irá remover permanentemente:
                        <ul className="mt-2 ml-4 list-disc text-sm">
                          <li>Sua conta e dados pessoais</li>
                          <li>Todo histórico de treinos</li>
                          <li>Todo histórico de nutrição</li>
                          <li>Histórico de pagamentos</li>
                        </ul>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    
                    <div className="space-y-4 my-4">
                      <div>
                        <Label className="text-white">Confirme sua senha</Label>
                        <Input
                          type="password"
                          placeholder="Digite sua senha atual"
                          value={deleteAccountData.password}
                          onChange={(e) => setDeleteAccountData({...deleteAccountData, password: e.target.value})}
                          className="bg-slate-700 border-slate-600 text-white mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-white">
                          Digite "<strong>excluir minha conta</strong>" para confirmar
                        </Label>
                        <Input
                          placeholder="excluir minha conta"
                          value={deleteAccountData.confirmationText}
                          onChange={(e) => setDeleteAccountData({...deleteAccountData, confirmationText: e.target.value})}
                          className="bg-slate-700 border-slate-600 text-white mt-1"
                        />
                      </div>
                    </div>

                    <AlertDialogFooter>
                      <AlertDialogCancel 
                        className="bg-slate-700 text-white hover:bg-slate-600"
                        onClick={() => setDeleteAccountData({password: '', confirmationText: ''})}
                      >
                        Cancelar
                      </AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={handleDeleteAccount}
                        disabled={isDeleting}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        {isDeleting ? 'Excluindo...' : 'Confirmar Exclusão'}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

// Main App Component
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/success" element={<PaymentSuccess />} />
            <Route path="/cancel" element={<PaymentCancel />} />
          </Routes>
          <Toaster />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }
  
  return user ? children : <Navigate to="/auth" />;
};

// Auth Page Component
const AuthPage = () => {
  const { user } = useAuth();
  
  if (user) {
    return <Navigate to="/dashboard" />;
  }
  
  return <AuthForms />;
};

// Payment Success Component
const PaymentSuccess = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('session_id');
    
    if (sessionId) {
      checkPaymentStatus(sessionId);
    }
  }, []);
  
  const checkPaymentStatus = async (sessionId, attempts = 0) => {
    const maxAttempts = 5;
    
    if (attempts >= maxAttempts) {
      toast({
        title: "Verificação de pagamento",
        description: "Não foi possível verificar o status do pagamento. Entre em contato conosco.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const response = await axios.get(`${API}/payments/status/${sessionId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      if (response.data.payment_status === 'paid') {
        toast({
          title: "Pagamento confirmado!",
          description: "Sua conta Premium foi ativada com sucesso."
        });
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        setTimeout(() => checkPaymentStatus(sessionId, attempts + 1), 2000);
      }
    } catch (error) {
      console.error('Error checking payment status:', error);
      setTimeout(() => checkPaymentStatus(sessionId, attempts + 1), 2000);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 text-center">
        <CardContent className="p-8">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-white mb-4">Pagamento Realizado!</h2>
          <p className="text-gray-400 mb-6">
            Estamos verificando seu pagamento. Você será redirecionado em instantes.
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
        </CardContent>
      </Card>
    </div>
  );
};

// Payment Cancel Component
const PaymentCancel = () => {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-slate-800 border-slate-700 text-center">
        <CardContent className="p-8">
          <div className="text-6xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-white mb-4">Pagamento Cancelado</h2>
          <p className="text-gray-400 mb-6">
            Não se preocupe! Você ainda pode fazer upgrade para Premium a qualquer momento.
          </p>
          <Button 
            onClick={() => window.location.href = '/dashboard'}
            className="bg-gradient-to-r from-orange-500 via-pink-500 to-red-500 hover:opacity-90 text-white"
          >
            Voltar ao Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;