import { Link, useLocation, useNavigate } from "react-router-dom";
import { DashboardOutlined, SearchOutlined, UserOutlined, EditOutlined, LogoutOutlined } from '@ant-design/icons';
import './Sidebar.css';
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../features/authSlice";




export default function Sidebar(){
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user} = useSelector((state)=>state.auth);
  const onLogout=(e)=>{
    dispatch(logout());
    navigate("/login");
  }

   const location = useLocation();

   const menuItems = [
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: <DashboardOutlined />
    },
    {
      path: '/search',
      label: 'Buscador',
      icon: <SearchOutlined />
    },
    {
        path: '/profile', 
      label: 'Profile', 
      icon: <UserOutlined /> 
    },
    { 
      path: '/create-post', 
      label: 'Publicar', 
      icon: <EditOutlined /> 
    },
   ]

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <h2>Chewbooka</h2>
            </div>
            <nav className="sidebar-nav">
           {menuItems.map((item)=>(
            <Link
            key={item.path}
            to={item.path}
            className={`sidebar-item ${location.pathname===item.path ? 'active': ''}`}>

            <span className="sidebar-icon">{item.icon}</span>
            <span className="sidebar-label">{item.label}</span>

           </Link>
           ))}
            </nav>

            {user && (
              <div className="sidebar-footer">
                <button className="sidebar-item logout-btn" onClick={onLogout}>
                  <span className="sidebar-icon"><LogoutOutlined /></span>
                  <span className="sidebar-label">Logout</span>
                </button>
              </div>
            )}
       
        </aside>
    )
}