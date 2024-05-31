const { createApp } = Vue;
const fields = Vue.ref([
  {
    name: 'spiritsAlcoholDegree',
    label: '使うお酒のアルコール度数',
    unit: '%',
    required: true,
  },
  {
    name: 'kakuteruAlcoholDegree',
    label: 'できあがりのアルコール度数',
    unit: '%',
    required: false,
  },
  {
    name: 'total',
    label: '総量',
    unit: 'g',
    required: false,
  },
  {
    name: 'spirits',
    label: '使うお酒',
    unit: 'g',
    required: false,
  },

  {
    name: 'splitting',
    label: '割り材',
    unit: 'g',
    required: false,
  },
])

const formData = {
  total: '',
  kakuteruAlcoholDegree: '',
  spirits: '',
  spiritsAlcoholDegree: '',
  splitting: ''
}
const kakuteru = null

createApp({
  data() {
    return {
      fields: fields,
      formData: formData,
      kakuteru: kakuteru,
    }
  },
  // watch: {
  //   'formData.spirits'(spirits) {
  //     // Trigger reactivity for name field disabling when email changes
  //     this.formData.total = this.formData.total;
  //     this.formData.splitting = this.formData.splitting // no-op to trigger reactivity
  //   }
  // },
  methods: {
    handleSubmit() {
      // 総量とできあがりの度数から求める
      if (formData.total !== '' && formData.kakuteruAlcoholDegree !== '') {
        const spiritsAlcoholDegree = this.formData.spiritsAlcoholDegree
        const total = this.formData.total
        const kakuteruAlcoholDegree = this.formData.kakuteruAlcoholDegree

        const alcohol = total * kakuteruAlcoholDegree / 100
        const spirits = alcohol * 100 / spiritsAlcoholDegree
        const splitting = total - spirits

        this.kakuteru = { total, kakuteruAlcoholDegree, spirits, spiritsAlcoholDegree, splitting }

        // 総量と使うお酒から求める
      } else if (formData.total !== '' && formData.spirits !== '') {
        const spiritsAlcoholDegree = this.formData.spiritsAlcoholDegree
        const total = this.formData.total
        const spirits = this.formData.spirits
        const splitting = total - spirits

        const alcohol = spirits * spiritsAlcoholDegree / 100
        const kakuteruAlcoholDegree = alcohol / total * 100

        this.kakuteru = { total, kakuteruAlcoholDegree, spirits, spiritsAlcoholDegree, splitting }

        // 総量と割り材から求める
      } else if (formData.total !== '' && formData.splitting !== '') {
        const spiritsAlcoholDegree = this.formData.spiritsAlcoholDegree
        const total = this.formData.total
        const splitting = this.formData.splitting
        const spirits = total - splitting

        const alcohol = spirits * spiritsAlcoholDegree / 100
        const kakuteruAlcoholDegree = alcohol / total * 100

        this.kakuteru = { total, kakuteruAlcoholDegree, spirits, spiritsAlcoholDegree, splitting }

        // 出来上がり度数と使うお酒から求める
      } else if (formData.kakuteruAlcoholDegree !== '' && formData.spirits !== '') {
        const spiritsAlcoholDegree = this.formData.spiritsAlcoholDegree
        const kakuteruAlcoholDegree = this.formData.kakuteruAlcoholDegree
        const spirits = this.formData.spirits

        const alcohol = spirits * spiritsAlcoholDegree / 100
        const total = alcohol / kakuteruAlcoholDegree * 100
        const splitting = total - spirits

        this.kakuteru = { total, kakuteruAlcoholDegree, spirits, spiritsAlcoholDegree, splitting }

        // 出来上がり度数と割り材から求める
      } else if (formData.kakuteruAlcoholDegree !== '' && formData.splitting !== '') {
        const spiritsAlcoholDegree = this.formData.spiritsAlcoholDegree
        const kakuteruAlcoholDegree = this.formData.kakuteruAlcoholDegree
        const splitting = this.formData.splitting

        const spirits = kakuteruAlcoholDegree * splitting / (spiritsAlcoholDegree - kakuteruAlcoholDegree)
        const total = splitting + spirits

        this.kakuteru = { total, kakuteruAlcoholDegree, spirits, spiritsAlcoholDegree, splitting }

        // 使うお酒と割り材から求める
      } else if (formData.spirits !== '' && formData.splitting !== '') {
        const spiritsAlcoholDegree = this.formData.spiritsAlcoholDegree
        const spirits = this.formData.spirits
        const splitting = this.formData.splitting

        const total = spirits + splitting
        const kakuteruAlcoholDegree = (spirits * spiritsAlcoholDegree / 100) / total * 100

        this.kakuteru = { total, kakuteruAlcoholDegree, spirits, spiritsAlcoholDegree, splitting }
      }
    },
    back() {
      this.kakuteru = null;
    },
    reset() {
      location.reload()
    },
    isDisabled(fieldName) {
      switch (fieldName) {
        case 'total':
          return (formData.splitting !== '' && formData.spirits !== '')
            || (formData.splitting !== '' && formData.kakuteruAlcoholDegree !== '')
            || (formData.spirits !== '' && formData.kakuteruAlcoholDegree !== '')
        case 'spirits':
          return formData.total !== ''
            && (formData.splitting !== '' || formData.kakuteruAlcoholDegree !== '')
            || (formData.splitting !== '' && formData.kakuteruAlcoholDegree !== '')
        case 'splitting':
          return formData.total !== ''
            && (formData.spirits !== '' || formData.kakuteruAlcoholDegree !== '')
            || (formData.spirits !== '' && formData.kakuteruAlcoholDegree !== '')
        case 'kakuteruAlcoholDegree':
          return (formData.splitting !== '' && formData.spirits !== '')
            || (formData.total !== '' && formData.splitting !== '')
            || (formData.total !== '' && formData.spirits !== '')
      }
    },
    submitDisabled() {
      return !(
        this.isDisabled('total')
        || this.isDisabled('spirits')
        || this.isDisabled('splitting')
        || this.isDisabled('kakuteruAlcoholDegree'))
    }
  }
}).mount('#app');

