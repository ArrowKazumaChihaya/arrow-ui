<!-- 下から出る一覧（ボトムシート） | placement="bottom"。スマホで「設定を選ぶ」「操作」などの一覧を下から出す。上の角だけ丸く、題は真ん中、高さは中身なり（最大 82%。height で決めることもできる）。見本は contained で枠の中に出している。 -->
<script setup lang="ts">
import { ref } from "vue";
import { ArButton, ArDrawer, ArIcon, ArTextInput } from "@arrow/ui";
const open = ref(true);
const q = ref("");
const cur = ref("基本設定");
const groups: [string, string[]][] = [["シフト", ["基本設定", "シフトテンプレート", "シフトグループ"]], ["勤怠", ["休日設定", "丸め設定", "打刻設定"]]];
</script>

<template>
  <div style="position: relative; width: 390px; height: 640px; max-width: 100%; overflow: hidden; border-radius: 12px; background: #eef2f6">
    <div style="padding: 16px"><ArButton @click="open = true">設定を選ぶ</ArButton></div>
    <ArDrawer v-model:open="open" placement="bottom" title="設定を選ぶ" contained>
      <ArTextInput v-model="q" type="search" placeholder="設定を探す（例：丸め）" label="設定を探す" size="lg" />
      <div v-for="g in groups" :key="g[0]" style="display: flex; flex-direction: column; margin: 0 -14px">
        <b style="font-size: 11.5px; color: #66727f; letter-spacing: .06em; padding: 8px 16px 4px">{{ g[0] }}</b>
        <button
          v-for="n in g[1]"
          :key="n"
          type="button"
          :style="{ display: 'flex', alignItems: 'center', gap: '10px', minHeight: '46px', padding: '0 16px', border: 0, background: cur === n ? 'var(--ar-accent-subtle)' : 'none', color: cur === n ? 'var(--ar-accent-ink)' : 'inherit', fontFamily: 'inherit', fontSize: '14.5px', fontWeight: 600, textAlign: 'left', cursor: 'pointer' }"
          @click="cur = n; open = false"
        >
          <ArIcon :name="g[0] === 'シフト' ? 'cal' : 'brief'" size="sm" />{{ n }}
        </button>
      </div>
    </ArDrawer>
  </div>
</template>
