import Vue from 'vue'
import tippy from 'tippy.js'
import 'tippy.js/dist/tippy.css'


function bind (el, binding) {
  if (binding.value) {
    el.tippyInstance = tippy(el, {
      maxWidth: 280,
      placement: 'bottom',
      content: binding.value
    })
  }
}

function unbind (el) {
  if (el.tippyInstance) {
    el.tippyInstance.destroy()
  }
}

Vue.directive('title-tippy', {
  update (el, binding) {
    unbind(el)
    bind(el, binding)
  },
  bind,
  unbind
})
