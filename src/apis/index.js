import { reactive, ref, watch, nextTick, onMounted, provide, inject } from "vue";
import { useRouter, useRoute, onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";
import * as http from 'axios';
import { useStore } from 'vuex'
import lodash from "lodash"
import Schema from 'async-validator';
const tools = {
  validator(formData, rules) {
    const v = new Schema(rules);
    return new Promise(function (resolve, reject) {
      v.validate(formData, (errors, fields) => {
        if (errors != null) {
          window.msg.pop(errors[0].message);
        }
        return resolve(errors == null);
      })
    });
  }
}
export { reactive, ref, watch, nextTick, onMounted, provide, inject }
export { useRouter, useRoute, onBeforeRouteLeave, onBeforeRouteUpdate }
export { http, lodash, tools }
export { useStore }