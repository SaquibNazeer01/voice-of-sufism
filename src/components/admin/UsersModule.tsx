import React, { useState } from 'react';
import { CmsUser, UserRole } from '../../types/cms';
import { 
  ShieldCheck, 
  Plus, 
  UserPlus, 
  Mail, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  Key, 
  Lock, 
  Upload, 
  Camera, 
  MapPin, 
  Award, 
  Clock, 
  X, 
  Eye, 
  EyeOff, 
  User,
  Shield,
  Sparkles,
  Feather,
  BookOpen,
  Search,
  LayoutGrid,
  List,
  Check,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import { SupabaseService } from '../../services/supabaseService';
import { sha256 } from '../../services/authService';

interface UsersModuleProps {
  users: CmsUser[];
  currentUser: CmsUser;
  onSaveUser: (user: CmsUser) => void;
  onDeleteUser: (id: string) => void;
  onUpdateCurrentUser?: (user: CmsUser) => void;
}

export const UsersModule: React.FC<UsersModuleProps> = ({
  users = [],
  currentUser,
  onSaveUser,
  onDeleteUser,
  onUpdateCurrentUser
}) => {
  const [selectedUser, setSelectedUser] = useState<CmsUser | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);
  const [resetPassUser, setResetPassUser] = useState<CmsUser | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState(false);
  
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const isSuperAdmin = currentUser?.role === 'Super Admin';

  const [formData, setFormData] = useState<Partial<CmsUser>>({
    name: '',
    email: '',
    role: 'Archive Contributor',
    status: 'Active',
    districtLocation: 'Srinagar'
  });

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const roleMeta: Record<UserRole, { label: string; badgeClass: string; desc: string; icon: React.FC<any> }> = {
    'Super Admin': {
      label: 'Super Admin',
      badgeClass: 'bg-amber-100 text-amber-950 border border-amber-300',
      desc: 'Full administrative control, user & role management, password resets, database wipes.',
      icon: ShieldCheck
    },
    'Senior Editor': {
      label: 'Senior Editor',
      badgeClass: 'bg-emerald-100 text-emerald-900 border border-emerald-300',
      desc: 'Publish, edit, and review research essays, shrines, saints, photos, and advertisements.',
      icon: Feather
    },
    'Cultural Scholar': {
      label: 'Cultural Scholar',
      badgeClass: 'bg-indigo-100 text-indigo-950 border border-indigo-300',
      desc: 'Create and document Sufi saint biographies, Vakhs & poetry, and craft traditions.',
      icon: BookOpen
    },
    'Archive Contributor': {
      label: 'Archive Contributor',
      badgeClass: 'bg-sky-100 text-sky-950 border border-sky-300',
      desc: 'Submit drafts of oral folklore stories, village traditions, and photo submissions.',
      icon: User
    }
  };

  const handleOpenAdd = () => {
    if (!isSuperAdmin) return;
    setSelectedUser(null);
    setPassword('');
    setShowPassword(false);
    const newUser: Partial<CmsUser> = {
      id: `user-${Date.now()}`,
      name: '',
      email: '',
      role: 'Archive Contributor',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      contributionsCount: 0,
      lastLogin: 'Never',
      districtLocation: 'Srinagar'
    };
    setFormData(newUser);
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (u: CmsUser) => {
    const isSelf = Boolean(
      (u.id && currentUser?.id && u.id === currentUser.id) ||
      (u.email && currentUser?.email && u.email.toLowerCase() === currentUser.email.toLowerCase())
    );
    if (!isSuperAdmin && !isSelf) return;

    setSelectedUser(u);
    setFormData({ ...u });
    setPassword('');
    setShowPassword(false);
    setIsEditModalOpen(true);
  };

  const handleOpenResetPass = (u: CmsUser) => {
    const isSelf = Boolean(
      (u.id && currentUser?.id && u.id === currentUser.id) ||
      (u.email && currentUser?.email && u.email.toLowerCase() === currentUser.email.toLowerCase())
    );
    if (!isSuperAdmin && !isSelf) return;

    setResetPassUser(u);
    setNewPassword('');
    setConfirmPassword('');
    setPassError('');
    setPassSuccess(false);
    setShowResetPassword(false);
    setIsResetPassModalOpen(true);
  };

  const handleSaveResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetPassUser) return;

    if (!newPassword || newPassword.length < 5) {
      setPassError('Password must be at least 5 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      const passwordHash = await sha256(newPassword);
      const updatedUser: CmsUser = {
        ...resetPassUser,
        passwordHash
      } as any;

      onSaveUser(updatedUser);

      // If resetting self password, sync current user state
      const isSelf = Boolean(
        (resetPassUser.id && currentUser?.id && resetPassUser.id === currentUser.id) ||
        (resetPassUser.email && currentUser?.email && resetPassUser.email.toLowerCase() === currentUser.email.toLowerCase())
      );
      if (isSelf && onUpdateCurrentUser) {
        onUpdateCurrentUser(updatedUser);
      }

      await SupabaseService.addActivityLog({
        user: currentUser?.name || 'Super Admin',
        action: `Reset Password for User`,
        target: `${resetPassUser.name} (${resetPassUser.email})`,
        badgeType: 'security'
      }).catch(() => {});

      setPassSuccess(true);
      setTimeout(() => {
        setIsResetPassModalOpen(false);
        setPassSuccess(false);
      }, 1500);
    } catch (err: any) {
      setPassError(err?.message || 'Failed to update password.');
    }
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.email) {
      let passwordHash = (selectedUser as any)?.passwordHash || '';
      if (password) {
        passwordHash = await sha256(password);
      }

      const updatedUser: CmsUser = {
        ...formData,
        avatar: formData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
        passwordHash,
        lastLogin: selectedUser ? (formData.lastLogin || 'Today') : new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })
      } as any;

      onSaveUser(updatedUser);

      // If editing self, sync live state across dashboard
      const isSelf = Boolean(
        (selectedUser?.id && currentUser?.id && selectedUser.id === currentUser.id) ||
        (selectedUser?.email && currentUser?.email && selectedUser.email.toLowerCase() === currentUser.email.toLowerCase())
      );
      if (isSelf && onUpdateCurrentUser) {
        onUpdateCurrentUser(updatedUser);
      }

      setIsEditModalOpen(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || (u.name || '').toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q) || (u.districtLocation || '').toLowerCase().includes(q);
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center space-x-2.5">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 tracking-tight">
              CMS Users & Role Governance
            </h2>
            {isSuperAdmin ? (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300 shadow-2xs">
                Super Admin Access
              </span>
            ) : (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-xs font-bold border border-emerald-300 shadow-2xs">
                Personal Profile Mode
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {isSuperAdmin 
              ? 'Accurately view, create, modify permissions, assign districts, and securely reset passwords for all editorial staff.' 
              : 'View editorial board members, verify assigned permissions, and update your credentials.'}
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={handleOpenAdd}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-800 to-[#0F4C3A] hover:from-emerald-700 hover:to-emerald-900 text-amber-300 font-bold text-xs flex items-center justify-center space-x-2 shadow-md hover:shadow-emerald-900/20 transition-all transform hover:scale-[1.02] active:scale-95 self-start sm:self-auto cursor-pointer"
          >
            <UserPlus className="w-4 h-4 text-amber-400" />
            <span>Add New CMS User</span>
          </button>
        )}
      </div>

      {/* Role Hierarchy Legend Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {(Object.keys(roleMeta) as UserRole[]).map((roleKey) => {
          const meta = roleMeta[roleKey];
          const Icon = meta.icon;
          const count = users.filter(u => u.role === roleKey).length;
          return (
            <div key={roleKey} className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${meta.badgeClass}`}>
                  {meta.label}
                </span>
                <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                  {count} {count === 1 ? 'User' : 'Users'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                {meta.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Toolbar: Search, Role Filter & View Switcher */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name, email, or district..."
            className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 bg-slate-50/70 font-medium placeholder:text-slate-400"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 p-0.5 text-slate-400 hover:text-slate-600 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdown & View Switcher */}
        <div className="flex items-center gap-2.5 w-full md:w-auto justify-between md:justify-end">
          <div className="flex items-center space-x-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50/70 font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 cursor-pointer"
            >
              <option value="All">All Roles ({users.length})</option>
              <option value="Super Admin">Super Admins ({users.filter(u => u.role === 'Super Admin').length})</option>
              <option value="Senior Editor">Senior Editors ({users.filter(u => u.role === 'Senior Editor').length})</option>
              <option value="Cultural Scholar">Cultural Scholars ({users.filter(u => u.role === 'Cultural Scholar').length})</option>
              <option value="Archive Contributor">Archive Contributors ({users.filter(u => u.role === 'Archive Contributor').length})</option>
            </select>
          </div>

          <div className="flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'table' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-700'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* Main Users List (Grid Mode) */}
      {viewMode === 'grid' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredUsers.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-400 bg-white rounded-3xl border border-slate-200 p-8 space-y-2">
              <User className="w-10 h-10 mx-auto text-slate-300" />
              <p className="font-bold text-slate-700">No users match your search criteria</p>
              <p className="text-xs">Try clearing filters or search query.</p>
            </div>
          ) : (
            filteredUsers.map((user) => {
              const isSelf = Boolean(
                (user.id && currentUser?.id && user.id === currentUser.id) ||
                (user.email && currentUser?.email && user.email.toLowerCase() === currentUser.email.toLowerCase())
              );
              const canEditThisUser = isSuperAdmin || isSelf;
              const meta = roleMeta[user.role] || roleMeta['Archive Contributor'];

              return (
                <div 
                  key={user.id} 
                  className={`bg-white rounded-3xl p-5 sm:p-6 shadow-xs border transition-all duration-200 relative overflow-hidden flex flex-col justify-between space-y-4 ${
                    isSelf 
                      ? 'border-amber-400 ring-2 ring-amber-400/20 shadow-md' 
                      : 'border-slate-200/80 hover:shadow-md hover:border-slate-300'
                  }`}
                >
                  {isSelf && (
                    <div className="absolute top-0 right-0 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-3 py-1 rounded-bl-2xl font-bold text-[10px] uppercase tracking-wider flex items-center space-x-1 shadow-xs">
                      <User className="w-3 h-3" />
                      <span>You</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-start space-x-3.5 pt-1">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F4C3A] via-[#14533D] to-emerald-950 text-amber-300 font-serif font-bold text-base flex items-center justify-center border-2 border-emerald-600/60 shadow-xs flex-shrink-0">
                        {getInitials(user.name)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-serif font-bold text-base text-slate-900 truncate max-w-[170px]">{user.name}</h3>
                        <p className="text-xs text-slate-500 truncate max-w-[170px]">{user.email}</p>
                        
                        <div className="mt-1.5 flex items-center space-x-1.5">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${meta.badgeClass}`}>
                            {user.role}
                          </span>
                          <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            user.status === 'Active' 
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                              : 'bg-rose-50 text-rose-800 border border-rose-200'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                            <span>{user.status}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Assigned Region:</span>
                        <span className="font-bold text-slate-800">{user.districtLocation || 'Srinagar'}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Published Items:</span>
                        <span className="font-mono font-bold text-slate-800">{user.contributionsCount || 0} Records</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-slate-500 font-medium">Last Active Session:</span>
                        <span className="text-slate-500 text-[11px] font-mono">{user.lastLogin || 'Never'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    {canEditThisUser ? (
                      <div className="flex items-center space-x-1.5 flex-1">
                        <button
                          onClick={() => handleOpenEdit(user)}
                          className="flex-1 py-1.5 px-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 text-xs font-bold flex items-center justify-center space-x-1 shadow-xs transition-colors cursor-pointer"
                          title="Edit User Details / Change Role"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>{isSelf ? 'Edit Profile' : 'Edit'}</span>
                        </button>

                        <button
                          onClick={() => handleOpenResetPass(user)}
                          className="py-1.5 px-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                          title="Reset Password"
                        >
                          <Key className="w-3.5 h-3.5 text-amber-700" />
                          <span>Pass</span>
                        </button>
                      </div>
                    ) : (
                      <span className="text-[11px] text-slate-400 italic">Read-only permissions</span>
                    )}

                    {isSuperAdmin && !isSelf && (
                      <button
                        onClick={() => setDeleteId(user.id)}
                        className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer shadow-2xs"
                        title="Delete User Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                </div>
              );
            })
          )}
        </div>
      )}

      {/* Main Users List (Table Mode) */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl shadow-xs border border-slate-200/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 text-slate-600 font-bold uppercase tracking-wider text-[11px] border-b border-slate-200/80">
                <tr>
                  <th className="py-3.5 px-4 sm:px-5">User</th>
                  <th className="py-3.5 px-4">Role Permission</th>
                  <th className="py-3.5 px-4">District Focus</th>
                  <th className="py-3.5 px-4">Contributions</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-800">
                {filteredUsers.map((user) => {
                  const isSelf = Boolean(
                    (user.id && currentUser?.id && user.id === currentUser.id) ||
                    (user.email && currentUser?.email && user.email.toLowerCase() === currentUser.email.toLowerCase())
                  );
                  const canEditThisUser = isSuperAdmin || isSelf;
                  const meta = roleMeta[user.role] || roleMeta['Archive Contributor'];

                  return (
                    <tr key={user.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 sm:px-5 align-middle">
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F4C3A] to-emerald-900 text-amber-300 font-serif font-bold text-xs flex items-center justify-center border border-emerald-600 shadow-2xs flex-shrink-0">
                            {getInitials(user.name)}
                          </div>
                          <div>
                            <p className="font-serif font-bold text-slate-900 text-sm flex items-center space-x-1.5">
                              <span>{user.name}</span>
                              {isSelf && (
                                <span className="text-[10px] bg-amber-400 text-slate-950 font-sans font-bold px-1.5 py-0.2 rounded">
                                  You
                                </span>
                              )}
                            </p>
                            <p className="text-[11px] text-slate-500">{user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 align-middle">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${meta.badgeClass}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 align-middle font-bold text-slate-700">
                        {user.districtLocation || 'Srinagar'}
                      </td>
                      <td className="py-3.5 px-4 align-middle font-mono font-bold text-emerald-800">
                        {user.contributionsCount || 0}
                      </td>
                      <td className="py-3.5 px-4 align-middle">
                        <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          user.status === 'Active' ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-rose-50 text-rose-800 border border-rose-200'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                          <span>{user.status}</span>
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right align-middle space-x-1.5">
                        {canEditThisUser ? (
                          <>
                            <button
                              onClick={() => handleOpenEdit(user)}
                              className="p-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 transition-colors cursor-pointer shadow-2xs"
                              title="Edit User"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => handleOpenResetPass(user)}
                              className="p-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 transition-colors cursor-pointer shadow-2xs"
                              title="Reset Password"
                            >
                              <Key className="w-3.5 h-3.5 text-amber-700" />
                            </button>
                          </>
                        ) : (
                          <span className="text-[11px] text-slate-400 italic">Read-only</span>
                        )}

                        {isSuperAdmin && !isSelf && (
                          <button
                            onClick={() => setDeleteId(user.id)}
                            className="p-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 transition-colors cursor-pointer shadow-2xs"
                            title="Delete Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Edit / Create Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 animate-scaleIn overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-5 bg-gradient-to-r from-[#0F4C3A] via-[#14533D] to-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-900/80 border border-emerald-500/40 flex items-center justify-center text-amber-300">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base sm:text-lg text-amber-100">
                    {selectedUser ? (selectedUser.id === currentUser.id ? 'Edit My Profile' : 'Modify User & Role') : 'Create New CMS User'}
                  </h3>
                  <p className="text-[11px] text-emerald-200/80">
                    {selectedUser ? `Updating details for ${selectedUser.name}` : 'Assign role permissions and credentials for editorial staff'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsEditModalOpen(false)} 
                className="p-1.5 rounded-xl bg-black/30 hover:bg-black/50 text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitUser} className="p-6 space-y-4 text-xs max-h-[75vh] overflow-y-auto custom-scrollbar">
              
              {/* User Avatar Badge Header */}
              <div className="flex items-center space-x-3.5 p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200/80">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#0F4C3A] to-emerald-900 text-amber-300 font-serif font-bold text-base flex items-center justify-center border-2 border-emerald-600/60 shadow-xs flex-shrink-0">
                  {getInitials(formData.name || 'User')}
                </div>
                <div className="min-w-0">
                  <p className="font-serif font-bold text-slate-900 text-sm truncate">{formData.name || 'New Staff User'}</p>
                  <p className="text-[11px] text-slate-500 truncate">{formData.email || 'editorial@voiceofsufism.org'}</p>
                  <span className="inline-block mt-0.5 text-[10px] text-emerald-800 font-semibold">
                    Assigned Role: {formData.role || 'Archive Contributor'}
                  </span>
                </div>
              </div>

              {/* Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                    placeholder="e.g. Dr. Shahida Reshi"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Address (Login ID)</label>
                  <input
                    type="email"
                    required
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                    placeholder="editor@voiceofsufism.org"
                  />
                </div>
              </div>

              {/* Optional Password Field (New Users or Update) */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-600" />
                    <span>{selectedUser ? 'Update Password (Optional)' : 'Initial Password *'}</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-mono">SHA-256 Encrypted</span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required={!selectedUser}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={selectedUser ? 'Leave blank to keep existing password...' : 'Enter initial security password...'}
                    className="w-full pr-10 p-2.5 rounded-xl border border-slate-200 bg-white font-mono text-xs focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Role & Status (Editable by Super Admin) */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Role Privilege {!isSuperAdmin && '(Restricted)'}
                  </label>
                  <select
                    disabled={!isSuperAdmin}
                    value={formData.role || 'Archive Contributor'}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium disabled:opacity-60 disabled:bg-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none cursor-pointer"
                  >
                    <option value="Super Admin">Super Admin (All Privileges)</option>
                    <option value="Senior Editor">Senior Editor (Publish & Review)</option>
                    <option value="Cultural Scholar">Cultural Scholar (Content Creator)</option>
                    <option value="Archive Contributor">Archive Contributor (Draft Submissions)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Account Status {!isSuperAdmin && '(Restricted)'}
                  </label>
                  <select
                    disabled={!isSuperAdmin}
                    value={formData.status || 'Active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'Active' | 'Suspended' })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium disabled:opacity-60 disabled:bg-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none cursor-pointer"
                  >
                    <option value="Active">Active (Permitted)</option>
                    <option value="Suspended">Suspended (Blocked)</option>
                  </select>
                </div>
              </div>

              {/* District & Contributions */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">District Focus</label>
                  <select
                    value={formData.districtLocation || 'Srinagar'}
                    onChange={(e) => setFormData({ ...formData, districtLocation: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-medium focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none cursor-pointer"
                  >
                    <optgroup label="— Kashmir Division (10 Districts) —">
                      <option value="Srinagar">Srinagar</option>
                      <option value="Budgam">Budgam</option>
                      <option value="Anantnag">Anantnag</option>
                      <option value="Baramulla">Baramulla</option>
                      <option value="Ganderbal">Ganderbal</option>
                      <option value="Pulwama">Pulwama</option>
                      <option value="Shopian">Shopian</option>
                      <option value="Kupwara">Kupwara</option>
                      <option value="Bandipora">Bandipora</option>
                      <option value="Kulgam">Kulgam</option>
                    </optgroup>
                    <optgroup label="— Jammu Division (10 Districts) —">
                      <option value="Jammu">Jammu</option>
                      <option value="Kathua">Kathua</option>
                      <option value="Udhampur">Udhampur</option>
                      <option value="Reasi">Reasi</option>
                      <option value="Rajouri">Rajouri</option>
                      <option value="Poonch">Poonch</option>
                      <option value="Doda">Doda</option>
                      <option value="Ramban">Ramban</option>
                      <option value="Kishtwar">Kishtwar</option>
                      <option value="Samba">Samba</option>
                    </optgroup>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Contributions Count</label>
                  <input
                    disabled={!isSuperAdmin}
                    type="number"
                    min="0"
                    value={formData.contributionsCount || 0}
                    onChange={(e) => setFormData({ ...formData, contributionsCount: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono disabled:opacity-60 disabled:bg-slate-100 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-3 border-t border-slate-100">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-800 to-[#0F4C3A] hover:from-emerald-700 hover:to-emerald-900 text-amber-300 font-bold text-xs shadow flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{selectedUser ? 'Save Changes' : 'Create Staff Account'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dedicated Reset Password Modal */}
      {isResetPassModalOpen && resetPassUser && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 animate-scaleIn overflow-hidden">
            
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-amber-600 via-amber-700 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-9 h-9 rounded-xl bg-black/40 border border-amber-300/40 flex items-center justify-center text-amber-300">
                  <Key className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-white">
                    Reset User Password
                  </h3>
                  <p className="text-[11px] text-amber-100/80">
                    Set a new security password for {resetPassUser.name}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsResetPassModalOpen(false)} 
                className="p-1.5 rounded-xl bg-black/30 hover:bg-black/50 text-slate-200 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveResetPassword} className="p-6 space-y-4 text-xs">
              
              {passSuccess && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 font-bold flex items-center space-x-2 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
                  <span>Password updated and encrypted successfully!</span>
                </div>
              )}

              {passError && (
                <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 font-bold flex items-center space-x-2 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 text-rose-700 flex-shrink-0" />
                  <span>{passError}</span>
                </div>
              )}

              {/* User Summary Pill */}
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F4C3A] to-emerald-900 text-amber-300 font-serif font-bold text-xs flex items-center justify-center flex-shrink-0">
                  {getInitials(resetPassUser.name)}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-900 truncate">{resetPassUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{resetPassUser.email} • {resetPassUser.role}</p>
                </div>
              </div>

              {/* New Password */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">New Password</label>
                <div className="relative">
                  <input
                    type={showResetPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      setPassError('');
                    }}
                    placeholder="Enter new security password..."
                    className="w-full pr-10 p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowResetPassword(!showResetPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showResetPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-1.5">
                <label className="block font-bold text-slate-700">Confirm New Password</label>
                <input
                  type={showResetPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setPassError('');
                  }}
                  placeholder="Re-type new password..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 focus:outline-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs shadow flex items-center justify-center space-x-2 transition-all cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Update & Encrypt Password</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsResetPassModalOpen(false)}
                  className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Delete User Dialog */}
      {deleteId && isSuperAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl p-6 sm:p-7 max-w-sm w-full shadow-2xl text-center space-y-4 border border-rose-200 animate-scaleIn">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200">
              <AlertCircle className="w-6 h-6" />
            </div>
            
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-lg text-slate-900">Remove Staff User?</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                This user will permanently lose editorial access and publishing privileges in the Voice of Sufism CMS.
              </p>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => { onDeleteUser(deleteId); setDeleteId(null); }}
                className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                Yes, Remove
              </button>
              <button
                onClick={() => setDeleteId(null)}
                className="flex-1 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
