<template>
  <div class="organizations-edit">
    <full-slider></full-slider>
    <div class="container">
      <thumbs-file-input></thumbs-file-input>

      <div class="row justify-content-center">
        <div class="col-lg-8 organizations-edit__editor">
          <no-ssr>
            <quill-editor
              v-model='editorContent'
              ref='textEditor'
              :options='editorOption'
            ></quill-editor>
          </no-ssr>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
    import FullSlider from '~/components/FullSlider'
    import ThumbsFileInput from '~/components/ThumbsFileInput'


    export default {
        middleware: 'auth',
        components:{
            FullSlider,
            ThumbsFileInput,
        },
        data: ()=>({
            editor: null,
            editorContent: '',
            editorOption: {
                modules: {
                    toolbar: false
                },
                placeholder: 'Почему к вам стоит прийти?',
                theme: 'snow',
            }
        }),
    }
</script>

<style>
</style>
