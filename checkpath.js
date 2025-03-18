window.addEventListener('hashchange', () => {
    console.log('Hash changed:', window.location.pathname);
});


if (location.pathname != '/login' && location.pathname != '/profile'){
    console.log(window.location.pathname);
    console.log("hhhhhhhhhhhh");
    
    localStorage.removeItem("token"); 
    document.getElementById('erro').innerHTML = `<p>404 page not found !!</p>`;
}