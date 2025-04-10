import { Link } from 'react-router-dom'
import HomeIcon from '@mui/icons-material/Home'
import EventNoteIcon from '@mui/icons-material/EventNote'
import PersonIcon from '@mui/icons-material/Person'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import './Sidebar.css'

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-menu">
        <Link to="/" className="menu-item">
          <HomeIcon />
          <span>Inicio</span>
        </Link>
        <Link to="/citas" className="menu-item">
          <EventNoteIcon />
          <span>Citas</span>
        </Link>
      </div>
      
      <div className="sidebar-footer">
        <Link to="/perfil" className="menu-item">
          <PersonIcon />
          <span>Perfil</span>
        </Link>
        <Link to="/salir" className="menu-item">
          <ExitToAppIcon />
          <span>Salir</span>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar