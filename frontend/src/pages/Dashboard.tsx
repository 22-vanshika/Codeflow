import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useVisualizationStore } from '../store/visualizationStore';
import { useNavigate } from 'react-router-dom';
import { LogOut, Code2, Play, Calendar } from 'lucide-react';

export default function Dashboard() {
    const { user, logout } = useAuthStore();
    const { visualizations, fetchUserVisualizations, isLoading } = useVisualizationStore();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate('/');
            return;
        }

        user.getIdToken().then(t => {
            fetchUserVisualizations(t);
        });
    }, [user, navigate, fetchUserVisualizations]);

    const handleLogout = async () => {
        await logout();
        navigate('/');
    };

    const handleOpenVis = (id: string) => {
        navigate(`/workspace?vid=${id}`);
    };

    if (!user) return null;

    return (
        <div className="min-h-screen pt-[80px] px-6 pb-12 bg-background text-text-primary">
            <div className="max-w-6xl mx-auto">
                
                {/* Profile Header */}
                <div className="bg-surface border border-white/5 rounded-2xl p-8 mb-8 flex items-center justify-between shadow-xl">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-primary to-secondary p-1">
                            <div className="w-full h-full bg-surface rounded-full overflow-hidden flex items-center justify-center">
                                {user.photoURL ? (
                                    <img src={user.photoURL} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span className="text-2xl font-bold text-white">{user.email?.[0].toUpperCase()}</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white mb-1">{user.displayName || 'Developer'}</h1>
                            <p className="text-text-muted">{user.email}</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:text-red-400 hover:bg-red-400/10 transition-colors"
                    >
                        <LogOut size={18} />
                        Logout
                    </button>
                </div>

                {/* Saved Visualizations */}
                <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-semibold flex items-center gap-2">
                        <Code2 className="text-primary" />
                        Saved Visualizations
                    </h2>
                    <button onClick={() => navigate('/workspace')} className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm font-medium transition-colors">
                        New Workspace
                    </button>
                </div>

                {isLoading ? (
                    <div className="text-center py-12 text-text-muted">Loading your visualizations...</div>
                ) : visualizations.length === 0 ? (
                    <div className="bg-surface border border-white/5 rounded-2xl p-12 text-center">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                            <Code2 size={32} className="text-text-muted" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">No visualizations saved yet</h3>
                        <p className="text-text-muted mb-6">Create your first visualization to see it here.</p>
                        <button onClick={() => navigate('/workspace')} className="px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-lg font-medium transition-colors">
                            Open Workspace
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {visualizations.map(vis => (
                            <div key={vis._id} className="group bg-surface border border-white/10 rounded-xl p-5 hover:border-primary/50 transition-all cursor-pointer shadow-lg hover:shadow-primary/10" onClick={() => handleOpenVis(vis._id)}>
                                <div className="flex justify-between items-start mb-3">
                                    <h3 className="text-lg font-medium text-white group-hover:text-primary transition-colors line-clamp-1">{vis.title}</h3>
                                    <span className="text-xs px-2 py-1 rounded bg-white/5 text-text-muted uppercase tracking-wider">{vis.language}</span>
                                </div>
                                <p className="text-sm text-text-secondary line-clamp-2 mb-4 h-10">
                                    {vis.description || 'No description provided.'}
                                </p>
                                <div className="flex items-center justify-between text-xs text-text-muted">
                                    <span className="flex items-center gap-1.5">
                                        <Calendar size={14} />
                                        {new Date(vis.createdAt).toLocaleDateString()}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <span className="flex items-center gap-1 hover:text-white transition-colors">
                                            <Play size={14} /> Open
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
