export default function Home() {
    //My very sad nav 
    return (
        <div>
            <h3>Home Page</h3>
            <nav>
                <ul>
                    <li><a href='/'>Home Page</a></li>
                    <li><a href='/record'>All Records</a></li>
                    <li><a href='/summary'>Account Summary</a></li>
                    <li><a href='/balance'>Account Balances</a></li>
                    <li><a href='/login'>Login</a></li>
                    <li><a href='/logout'>Logout</a></li>
                    <li><a href='/record/add'>Register New Account</a></li>
                </ul>
            </nav>
        </div>
    );
}