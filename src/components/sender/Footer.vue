<template>
  <div class="footer">
    <ul>
      <li>View the source on
        <a href="http://github.com/alfg/mediacast">Github</a>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Footer"
};
</script>

<style scoped>
.footer {
  margin-top: 40px;
}
ul {
  margin: 20px 0;
  padding: 0;
  text-align: center;
}
ul li {
  display: inline-block;
  padding: 0 6px;
}
a {
  color: #643fa6;
  text-decoration: none;
  outline: 0;
  line-height: inherit;
}
a:hover {
  text-decoration: underline;
}
</style>