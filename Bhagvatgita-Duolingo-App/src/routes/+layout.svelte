<script lang="ts">
  import '../app.css';
  
  // Svelte 5 children snippet destructuring
  let { children } = $props();
</script>

<!-- Desktop backdrop: centers the mobile app with a dark premium gradient -->
<div class="min-h-screen w-full bg-slate-950 flex items-center justify-center sm:p-4 text-slate-100">
  <!-- Mobile App Frame -->
  <main class="w-full h-screen sm:h-[840px] sm:max-w-md sm:rounded-3xl sm:border sm:border-slate-800 bg-slate-900 shadow-2xl flex flex-col relative overflow-hidden">
    {@render children()}
  </main>
</div>
