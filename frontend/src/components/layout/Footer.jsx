import { Link } from 'react-router-dom';
import { HiOutlineBookOpen } from 'react-icons/hi';

const FOOTER_LINKS = {
  Product:     [['Browse Resources','/browse'],['Upload','/upload'],['Leaderboard','/leaderboard'],['Dashboard','/dashboard']],
  Resources:   [['Notes','/browse?type=notes'],['Previous Year Papers','/browse?type=pyq'],['Assignments','/browse?type=assignment'],['Lab Manuals','/browse?type=lab']],
  Departments: [['CSE','/browse?branch=CSE'],['ECE','/browse?branch=ECE'],['ME','/browse?branch=ME'],['CE','/browse?branch=CE'],['IT','/browse?branch=IT']],
  Support:     [['Get Started','/register'],['Sign In','/login'],['Reset Password','/forgot-password']],
};

export default function Footer() {
  return (
    <footer style={{ background: 'linear-gradient(180deg, #DDD8C0 0%, #CCC6A8 40%, #BCB694 100%)' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-16 pb-10">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-10 mb-12">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                   style={{ background: 'linear-gradient(135deg, #7A6F35, #6E632E)' }}>
                <HiOutlineBookOpen className="w-4 h-4" style={{ color: '#F5F0DC' }} />
              </div>
              <span className="font-bold text-[15px] tracking-tight text-[#2C2A1E]">CampusShare</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-[190px]" style={{ color: '#6B6344' }}>
              The academic resource hub for Jai Narain College of Technology, Bhopal.
            </p>
            <p className="text-xs mt-4" style={{ color: '#9A8F5A' }}>Affiliated to RGPV, Bhopal</p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#6E632E' }}>{group}</h4>
              <ul className="space-y-2.5">
                {links.map(([label, to]) => (
                  <li key={label}>
                    <Link to={to} className="text-sm transition-colors duration-150 hover:text-[#6E632E]" style={{ color: '#6B6344' }}>
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8"
             style={{ borderTop: '1px solid rgba(110,99,46,0.15)' }}>
          <p className="text-xs" style={{ color: '#9A8F5A' }}>
            © {new Date().getFullYear()} CampusShare · Jai Narain College of Technology
          </p>
          <p className="text-xs" style={{ color: '#9A8F5A' }}>Built by students, for students.</p>
        </div>
      </div>
    </footer>
  );
}
