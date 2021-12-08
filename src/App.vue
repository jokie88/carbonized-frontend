<template>
  <div class="col container justify-content-center">
    <nav class="navbar navbar-light navbar-expand-sm">
      <a class="navbar-brand" href="/">carbonized.xyz</a>
      <div class="" id="navbarText">
        <ul class="navbar-nav flex-row float-right">
          <li class="nav-item">
            <router-link to="/about" class="nav-link  pr-3">FAQ</router-link>
          </li>
          <li class="nav-item">
            <a href="https://www.carbonized.xyz" class="nav-link">About</a>
          </li>

        </ul>

      </div>
    </nav>
    <br /><br />
    <router-view></router-view>
    <br />
  </div>
  <footer>
    &copy 2021 carbonized.xyz
  </footer>
</template>

<script>
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
footer {
  margin: 50px 0px;
}
</style>
