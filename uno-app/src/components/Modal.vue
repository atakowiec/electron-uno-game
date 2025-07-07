<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps({
  shown: Boolean,
});
const emit = defineEmits(['update:shown']);

const modalRef = ref<HTMLElement | null>(null);
const timeoutId = ref<Node.Timeout | null>(null);

watch(() => props.shown, (newValue) => {
  if (!modalRef.value) {
    return;
  }

  clearTimeout(timeoutId.value);

  let classToAdd = newValue ? 'showing' : 'hiding';
  let classToAddAfter = newValue ? 'shown' : 'hidden';

  // if modal should be hidden, remove the 'shown' class and add 'hiding'
  modalRef.value.classList.remove('hidden', 'hiding', 'showing', 'shown');
  modalRef.value.classList.add(classToAdd);

  // after the transition ends, add 'hidden' class to actually
  timeoutId.value = setTimeout(() => {
    if (modalRef.value) {
      modalRef.value.classList.remove('hidden', 'hiding', 'showing', 'shown');
      modalRef.value.classList.add(classToAddAfter);
    }
  }, 600);
});

function onBgClick() {
  emit('update:shown', false);
}
</script>

<template>
  <div class="modal hidden" ref="modalRef" @click="onBgClick">
    <div class="modal-content " @click.stop>
      <div class="content-wrapper">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<!--suppress CssUnusedSymbol -->
<style scoped>
.modal {
  position: fixed;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20000;
  display: flex;
  transition: background-color .6s ease-in-out;

  .modal-content {
    background-color: #0D5A94;
    width: 400px;
    padding-bottom: 20px;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    transition: scale .6s ease-in-out;
    text-align: center;
    color: white
  }

  &.hidden {
    background-color: #0000;
    scale: 0;

    .modal-content {
      scale: 0;
    }

    .content-wrapper {
      opacity: 0 !important;
    }
  }

  &.hiding {
    background-color: #0000;

    .modal-content {
      scale: 0;
      animation: flipAnimation .6s reverse;
    }

    .content-wrapper {
      animation: contentShowing .6s reverse;
    }
  }

  &.showing {
    background-color: #0008;

    .modal-content {
      scale: 1;
      animation: flipAnimation .6s normal;
    }

    .content-wrapper {
      animation: contentShowing .6s normal;
    }
  }

  &.shown {
    background-color: #0008;

    .modal-content {
      scale: 1;
      opacity: unset;
    }

    .content-wrapper {
      opacity: 1;
    }
  }
}

@keyframes flipAnimation {
  0% {
    transform: rotateY(0deg) rotateZ(90deg) rotateX(90deg);
    margin-bottom: -600px;
  }
  40% {
    transform: rotateY(0deg) rotateZ(45deg) rotateX(0deg);
    width: 242px;
    height: 362px;
    background-image: url("/cards/card_back.png");
    background-size: contain;
    background-repeat: no-repeat;
    background-color: transparent;
    box-shadow: none;
  }
  70% {
    transform: rotateY(90deg) rotateZ(0deg) rotateX(0deg);
  }
  100% {
    transform: rotateY(0deg);
  }
}

@keyframes contentShowing {
  70% {
    opacity: 0;
  }
  71% {
    opacity: 1;
  }
}

</style>