<!-- MyPC打刻 | マイページの打刻画面。今の状態（まだ出勤していない・勤務中・休憩中・退勤済み）で押せるボタンが変わり、押せないボタンの下に理由を書く。押すと punch（どの打刻か）を出す。 -->
<script setup lang="ts">
import { computed, ref } from "vue";
import { ArPunchButton, ArSegmented } from "@arrow/ui";

type St = "off" | "in" | "brk" | "done";
const st = ref<St>("off");
const at = ref({ in: "13:02", brk: "17:00" });
const why = computed(() => ({
  in: st.value === "off" ? undefined : st.value === "done" ? "今日は退勤済みです" : `出勤済み（${at.value.in}）`,
  out: st.value === "in" ? undefined : st.value === "off" ? "出勤してから押せます" : st.value === "brk" ? "休憩中は退勤できません。先に「休憩終了」を押します" : "今日は退勤済みです",
  bin: st.value === "in" ? undefined : st.value === "off" ? "出勤してから押せます" : st.value === "brk" ? `休憩中（${at.value.brk}〜）` : "今日は退勤済みです",
  bout: st.value === "brk" ? undefined : "休憩を始めてから押せます",
}));
const next: Record<string, St> = { in: "in", out: "done", "break-in": "brk", "break-out": "in" };
function punch(k: string) {
  st.value = next[k]!;
}
</script>

<template>
  <div style="max-width: 784px; display: flex; flex-direction: column; gap: 16px; padding: 18px; border-radius: 18px; background: #fff">
    <ArSegmented
      label="今の状態"
      v-model="st"
      :options="[
        { value: 'off', label: 'まだ出勤していない' },
        { value: 'in', label: '勤務中' },
        { value: 'brk', label: '休憩中' },
        { value: 'done', label: '退勤済み' },
      ]"
    />
    <div style="display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px">
      <ArPunchButton kind="in" :disabled="!!why.in" :reason="why.in" @punch="punch" />
      <ArPunchButton kind="out" :disabled="!!why.out" :reason="why.out" @punch="punch" />
      <ArPunchButton kind="break-in" :disabled="!!why.bin" :reason="why.bin" @punch="punch" />
      <ArPunchButton kind="break-out" :disabled="!!why.bout" :reason="why.bout" @punch="punch" />
    </div>
  </div>
</template>
