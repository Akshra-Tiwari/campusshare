import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiOutlineHome, HiOutlineSearch } from 'react-icons/hi';

export default function NotFoundPage() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6" style={{background:'linear-gradient(135deg,rgba(219,209,237,0.25),rgba(237,232,208,0.95),rgba(171,190,237,0.20))'}}>
      <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}} className="text-center max-w-md">
        <p className="text-8xl font-black tracking-tight" style={{color:'rgba(110,99,46,0.10)'}}>404</p>
        <h1 className="text-2xl font-bold text-[#2C2A1E] -mt-4 mb-3">Page not found</h1>
        <p className="mb-8" style={{color:'#6B6344'}}>The page you're looking for doesn't exist or has been moved.</p>
        <div className="flex gap-3 justify-center">
          <Link to="/" className="btn-olive"><HiOutlineHome className="w-4 h-4"/> Go Home</Link>
          <Link to="/browse" className="btn-ghost"><HiOutlineSearch className="w-4 h-4"/> Browse Resources</Link>
        </div>
      </motion.div>
    </div>
  );
}
