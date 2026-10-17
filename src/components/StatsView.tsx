import React from 'react';
import { motion } from 'motion/react';
import { 
  PieChart, Pie, Cell, 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  ResponsiveContainer, LineChart, Line 
} from 'recharts';
import { ACADEMY_STATS, SPECIALTY_TRENDS } from '../constants';
import { BarChart3, TrendingUp, Users, Shield } from 'lucide-react';

export const StatsView: React.FC = () => {
  return (
    <div className="space-y-12 pb-20">
      {/* Header section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl sm:text-5xl font-display font-bold text-gold tracking-tighter">
          Censo de la Academia
        </h2>
        <p className="text-gold-dim/70 max-w-2xl mx-auto text-sm sm:text-base italic">
          "Las estrellas dictan el destino, pero los números revelan la verdad de la vocación médica."
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* House Distribution */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-surface p-6 sm:p-8 rounded-3xl border border-gold/10"
        >
          <div className="flex items-center space-x-3 mb-8">
            <Shield className="text-gold" size={24} />
            <h3 className="text-xl font-display text-white uppercase tracking-widest">Distribución de Casas</h3>
          </div>
          
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={ACADEMY_STATS}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  isAnimationActive={false}
                >
                  {ACADEMY_STATS.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 16, 32, 0.9)', 
                    border: '1px solid rgba(197, 160, 89, 0.2)',
                    borderRadius: '12px',
                    color: '#fff'
                  }}
                  itemStyle={{ color: '#fff' }}
                />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-6 grid grid-cols-2 gap-4">
            {ACADEMY_STATS.map((stat) => (
              <div key={stat.name} className="bg-white/5 p-3 rounded-xl border border-white/5">
                <div className="text-[10px] uppercase tracking-tighter text-gold-dim">{stat.name}</div>
                <div className="text-sm font-medium text-white">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Trends over time */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="glass-surface p-6 sm:p-8 rounded-3xl border border-gold/10"
        >
          <div className="flex items-center space-x-3 mb-8">
            <TrendingUp className="text-medical-teal" size={24} />
            <h3 className="text-xl font-display text-white uppercase tracking-widest">Tendencias de Vocación</h3>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={SPECIALTY_TRENDS}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis 
                  dataKey="month" 
                  stroke="rgba(197, 160, 89, 0.5)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <YAxis 
                  stroke="rgba(197, 160, 89, 0.5)" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(10, 16, 32, 0.9)', 
                    border: '1px solid rgba(197, 160, 89, 0.2)',
                    borderRadius: '12px',
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="Gryffindor" stroke="#991b1b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Slytherin" stroke="#064e3b" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Ravenclaw" stroke="#1e3a8a" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="Hufflepuff" stroke="#854d0e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-8 flex items-center justify-center space-x-2 text-gold-dim text-[10px] uppercase tracking-widest">
            <TrendingUp size={12} className="animate-pulse" />
            <span>Los datos reflejan las decisiones del último semestre místico.</span>
          </div>
        </motion.div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Postulantes', val: '4,521', color: 'text-gold' },
          { icon: BarChart3, label: 'Tasa de Éxito', val: '92%', color: 'text-medical-teal' },
          { icon: Shield, label: 'Años Activos', val: '682', color: 'text-gold' },
          { icon: TrendingUp, label: 'Crecimiento', val: '+14%', color: 'text-medical-teal' },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="glass-surface p-4 rounded-2xl border border-gold/5 text-center flex flex-col items-center space-y-2 hover:border-gold/20 transition-all cursor-default"
          >
            <item.icon className={item.color} size={20} />
            <div className="text-[10px] uppercase tracking-widest text-gold-dim">{item.label}</div>
            <div className="text-xl font-display font-medium text-white">{item.val}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
