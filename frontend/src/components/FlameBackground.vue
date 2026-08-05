<template>
  <div class="flame-container">
    <div class="flame-particles" v-for="i in 15" :key="i"></div>
    <slot></slot>
  </div>
</template>