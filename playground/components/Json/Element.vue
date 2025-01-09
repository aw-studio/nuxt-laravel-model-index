<template>
  <li class="py-[2px] hover:bg-athens-gray-800">
    <div class="flex flex-wrap">
      <button
        class="relative pr-1 font-semibold text-blue-600"
        @click="toggle()"
      >
        {{ label }}<span class="text-athens-gray-500">:</span>
        <div
          v-if="isArray || isObject"
          class="absolute top-0 flex items-center h-full -left-3"
        >
          <svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            class="w-2 h-2 fill-white"
            :class="!show ? 'transform -rotate-90' : ''"
          >
            <path d="M6 9l6 6 6-6"></path>
          </svg>
        </div>
      </button>
      <span>
        <span v-if="isArray" class="text-athens-gray-500">[</span>
        <span v-else-if="isObject" class="text-athens-gray-500">{</span>
      </span>
      <div
        v-if="isString || isNumber || isBoolean"
        :class="{
          'text-salmon-500': isNumber,
          'text-green-500': isString,
          'text-orange-500': isBoolean,
        }"
        class="font-semibold"
      >
        <span v-if="isString">"</span>
        <span v-if="isBoolean">
          {{ el ? 'true' : 'false' }}
        </span>
        <span v-else>
          {{ el }}
        </span>
        <span v-if="isString">"</span>
      </div>
      <div v-if="(isArray || isObject) && show" class="w-full pl-5">
        <Element
          v-for="(child, key) in el"
          :key="key"
          :el="child"
          :label="key"
        />
      </div>
      <div v-if="!show && (isArray || isObject)">
        <span>…</span>
      </div>
      <span>
        <span v-if="isArray" class="text-athens-gray-500">]</span>
        <span v-else-if="isObject" class="text-athens-gray-500">}</span>
      </span>
    </div>
  </li>
</template>
<script setup lang="ts">
import Element from './Element.vue';
const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  el: {
    type: [Object, Array, String, Boolean, Number],
    required: true,
  },
});

const isArray = Array.isArray(props.el);
const isObject = typeof props.el === 'object';
const isString = typeof props.el === 'string';
const isNumber = typeof props.el === 'number';
const isBoolean = typeof props.el === 'boolean';

const show = ref(false);

const toggle = () => {
  if (isArray || isObject) {
    show.value = !show.value;
  }
};
</script>
