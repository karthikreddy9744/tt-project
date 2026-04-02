import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiUsers, FiFileText, FiMessageSquare, FiVideo, FiArrowRight, FiShield, FiTrendingUp } from 'react-icons/fi';

export const LandingPage = () => {
  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center py-20 px-6 bg-background-dark">
      <div className="container mx-auto max-w-6xl relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-400 text-sm font-bold uppercase tracking-widest mb-4">
            <FiTrendingUp /> The #1 Platform for Peer Learning
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1] tracking-tight">
            Master Your Studies <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-indigo-400 to-secondary-500">
              Together.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
            Supercharge your learning journey with collaborative groups, real-time sessions, and peer-reviewed study materials.
          </p>
          <div className="pt-8 flex flex-wrap justify-center gap-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-4 bg-primary-500 text-white rounded-2xl flex items-center gap-2">
              Join StudySync Now <FiArrowRight size={20} />
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-4 border border-white/10 text-white rounded-2xl flex items-center gap-2 hover:bg-white/5 transition-colors">
              Explore Groups
            </Link>
          </div>
          
          <div className="pt-12 flex justify-center items-center gap-8 text-slate-500 font-bold uppercase tracking-widest text-[10px]">
            <div className="flex items-center gap-2"><FiShield /> Secure Platform</div>
            <div className="flex items-center gap-2"><FiUsers /> 10k+ Students</div>
            <div className="flex items-center gap-2"><FiVideo /> 24/7 Live Study</div>
          </div>
        </motion.div>

        <motion.div
          className="mt-24 grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <FeatureCard
            icon={<FiUsers />}
            title="Study Groups"
            description="Find or create groups for any subject, from Calculus to Art History."
          />
          <FeatureCard
            icon={<FiFileText />}
            title="Shared Resources"
            description="Collaborative file management with peer-reviewed voting system."
          />
          <FeatureCard
            icon={<FiMessageSquare />}
            title="Peer Discussions"
            description="Threaded conversations to solve complex problems together."
          />
          <FeatureCard
            icon={<FiVideo />}
            title="Live Sessions"
            description="Interactive real-time study rooms with shared whiteboard."
          />
        </motion.div>
      </div>
      
      {/* Decorative element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-500/5 rounded-full blur-[150px]"></div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description }) => {
  return (
    <motion.div
      className="glass-dark p-8 group border border-white/10 rounded-3xl hover:border-primary-500/50 transition-all text-left"
      whileHover={{ y: -10 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary-400 text-3xl mb-6 group-hover:bg-primary-500 group-hover:text-white transition-all duration-300 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-white mb-3">{title}</h3>
      <p className="text-slate-400 text-sm leading-relaxed">{description}</p>
    </motion.div>
  );
};
