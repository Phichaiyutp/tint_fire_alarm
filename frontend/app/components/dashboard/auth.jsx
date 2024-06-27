"use client";
import React, { useEffect, useState } from "react";
import { LuLogOut } from "react-icons/lu";
import { FaRegUser } from "react-icons/fa";
import { getCookie,deleteCookie } from "cookies-next";
import { useRouter } from "next/navigation";

export function Profile() {
  const key = getCookie("access_token");
  const [profile, setProfile] = useState(null);
  const router = useRouter();
  useEffect(() => {
    if (key) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_API}/api/auth/user`, {
        method: "GET",
          headers: {
            "Authorization" : `Bearer ${key}`
          }
      })
        .then((response) => response.json())
        .then((data) => {
          const profile = data.image ? data : { ...data, image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjY0cHgiIGhlaWdodD0iMjgwcHgiIHZpZXdCb3g9IjAgMCAyNjQgMjgwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxkZXNjPkNyZWF0ZWQgd2l0aCBnZXRhdmF0YWFhcnMuY29tPC9kZXNjPjxkZWZzPjxjaXJjbGUgaWQ9InJlYWN0LXBhdGgtMSIgY3g9IjEyMCIgY3k9IjEyMCIgcj0iMTIwIj48L2NpcmNsZT48cGF0aCBkPSJNMTIsMTYwIEMxMiwyMjYuMjc0MTcgNjUuNzI1ODMsMjgwIDEzMiwyODAgQzE5OC4yNzQxNywyODAgMjUyLDIyNi4yNzQxNyAyNTIsMTYwIEwyNjQsMTYwIEwyNjQsLTEuNDIxMDg1NDdlLTE0IEwtMy4xOTc0NDIzMWUtMTQsLTEuNDIxMDg1NDdlLTE0IEwtMy4xOTc0NDIzMWUtMTQsMTYwIEwxMiwxNjAgWiIgaWQ9InJlYWN0LXBhdGgtMiI+PC9wYXRoPjxwYXRoIGQ9Ik0xMjQsMTQ0LjYxMDk1MSBMMTI0LDE2MyBMMTI4LDE2MyBMMTI4LDE2MyBDMTY3Ljc2NDUwMiwxNjMgMjAwLDE5NS4yMzU0OTggMjAwLDIzNSBMMjAwLDI0NCBMMCwyNDQgTDAsMjM1IEMtNC44Njk3NDcwMWUtMTUsMTk1LjIzNTQ5OCAzMi4yMzU0OTgsMTYzIDcyLDE2MyBMNzIsMTYzIEw3NiwxNjMgTDc2LDE0NC42MTA5NTEgQzU4Ljc2MjYzNDUsMTM2LjQyMjM3MiA0Ni4zNzIyMjQ2LDExOS42ODcwMTEgNDQuMzA1MTM4OCw5OS44ODEyMzg1IEMzOC40ODAzMTA1LDk5LjA1Nzc4NjYgMzQsOTQuMDUyMTA5NiAzNCw4OCBMMzQsNzQgQzM0LDY4LjA1NDAwNzQgMzguMzI0NTczMyw2My4xMTgwNzMxIDQ0LDYyLjE2NTkxNjkgTDQ0LDU2IEw0NCw1NiBDNDQsMjUuMDcyMDU0IDY5LjA3MjA1NCw1LjY4MTM3MTUxZS0xNSAxMDAsMCBMMTAwLDAgTDEwMCwwIEMxMzAuOTI3OTQ2LC01LjY4MTM3MTUxZS0xNSAxNTYsMjUuMDcyMDU0IDE1Niw1NiBMMTU2LDYyLjE2NTkxNjkgQzE2MS42NzU0MjcsNjMuMTE4MDczMSAxNjYsNjguMDU0MDA3NCAxNjYsNzQgTDE2Niw4OCBDMTY2LDk0LjA1MjEwOTYgMTYxLjUxOTY5LDk5LjA1Nzc4NjYgMTU1LjY5NDg2MSw5OS44ODEyMzg1IEMxNTMuNjI3Nzc1LDExOS42ODcwMTEgMTQxLjIzNzM2NSwxMzYuNDIyMzcyIDEyNCwxNDQuNjEwOTUxIFoiIGlkPSJyZWFjdC1wYXRoLTMiPjwvcGF0aD48L2RlZnM+PGcgaWQ9IkF2YXRhYWFyIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtODI1LjAwMDAwMCwgLTExMDAuMDAwMDAwKSIgaWQ9IkF2YXRhYWFyL0NpcmNsZSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoODI1LjAwMDAwMCwgMTEwMC4wMDAwMDApIj48ZyBpZD0iQ2lyY2xlIiBzdHJva2Utd2lkdGg9IjEiIGZpbGwtcnVsZT0iZXZlbm9kZCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTIuMDAwMDAwLCA0MC4wMDAwMDApIj48bWFzayBpZD0icmVhY3QtbWFzay00IiBmaWxsPSJ3aGl0ZSI+PHVzZSB4bGluazpocmVmPSIjcmVhY3QtcGF0aC0xIj48L3VzZT48L21hc2s+PHVzZSBpZD0iQ2lyY2xlLUJhY2tncm91bmQiIGZpbGw9IiNFNkU2RTYiIHhsaW5rOmhyZWY9IiNyZWFjdC1wYXRoLTEiPjwvdXNlPjxnIGlkPSJDb2xvci9QYWxldHRlL0JsdWUtMDEiIG1hc2s9InVybCgjcmVhY3QtbWFzay00KSIgZmlsbD0iIzY1QzlGRiI+PHJlY3QgaWQ9IvCflo1Db2xvciIgeD0iMCIgeT0iMCIgd2lkdGg9IjI0MCIgaGVpZ2h0PSIyNDAiPjwvcmVjdD48L2c+PC9nPjxtYXNrIGlkPSJyZWFjdC1tYXNrLTUiIGZpbGw9IndoaXRlIj48dXNlIHhsaW5rOmhyZWY9IiNyZWFjdC1wYXRoLTIiPjwvdXNlPjwvbWFzaz48ZyBpZD0iTWFzayI+PC9nPjxnIGlkPSJBdmF0YWFhciIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG1hc2s9InVybCgjcmVhY3QtbWFzay01KSI+PGcgaWQ9IkJvZHkiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDMyLjAwMDAwMCwgMzYuMDAwMDAwKSI+PG1hc2sgaWQ9InJlYWN0LW1hc2stNiIgZmlsbD0id2hpdGUiPjx1c2UgeGxpbms6aHJlZj0iI3JlYWN0LXBhdGgtMyI+PC91c2U+PC9tYXNrPjx1c2UgZmlsbD0iI0QwQzZBQyIgeGxpbms6aHJlZj0iI3JlYWN0LXBhdGgtMyI+PC91c2U+PGcgaWQ9IlNraW4v8J+RtvCfj70tMDMtQnJvd24iIG1hc2s9InVybCgjcmVhY3QtbWFzay02KSIgZmlsbD0iI0VEQjk4QSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDAuMDAwMDAwKSIgaWQ9IkNvbG9yIj48cmVjdCB4PSIwIiB5PSIwIiB3aWR0aD0iMjY0IiBoZWlnaHQ9IjI4MCI+PC9yZWN0PjwvZz48L2c+PHBhdGggZD0iTTE1Niw3OSBMMTU2LDEwMiBDMTU2LDEzMi45Mjc5NDYgMTMwLjkyNzk0NiwxNTggMTAwLDE1OCBDNjkuMDcyMDU0LDE1OCA0NCwxMzIuOTI3OTQ2IDQ0LDEwMiBMNDQsNzkgTDQ0LDk0IEM0NCwxMjQuOTI3OTQ2IDY5LjA3MjA1NCwxNTAgMTAwLDE1MCBDMTMwLjkyNzk0NiwxNTAgMTU2LDEyNC45Mjc5NDYgMTU2LDk0IEwxNTYsNzkgWiIgaWQ9Ik5lY2stU2hhZG93IiBmaWxsLW9wYWNpdHk9IjAuMTAwMDAwMDAxIiBmaWxsPSIjMDAwMDAwIiBtYXNrPSJ1cmwoI3JlYWN0LW1hc2stNikiPjwvcGF0aD48L2c+PGcgaWQ9IkNsb3RoaW5nL0JsYXplci0rLVNoaXJ0IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgMTcwLjAwMDAwMCkiPjxkZWZzPjxwYXRoIGQ9Ik0xMzMuOTYwNDcyLDAuMjk0OTE2MTEyIEMxNzAuOTM2NDczLDMuMzI0OTk4MTYgMjAwLDM0LjI5NDI4NTYgMjAwLDcyLjA1MTcyMzUgTDIwMCw4MSBMMCw4MSBMMCw3Mi4wNTE3MjM1IEMxLjIyNTM2MjQ1ZS0xNCwzMy45NTI1NjMxIDI5LjU5MTk4NSwyLjc2NDk4MTIyIDY3LjA0NTQwNjMsMC4yMTk1MjY0MDggQzY3LjAxNTI1OTgsMC41OTMxMTQ1NDkgNjcsMC45NjkyMjcxODUgNjcsMS4zNDc2MjUxMSBDNjcsMTMuMjEwNzE3NyA4MS45OTg0NjA5LDIyLjgyNzY1NDQgMTAwLjUsMjIuODI3NjU0NCBDMTE5LjAwMTUzOSwyMi44Mjc2NTQ0IDEzNCwxMy4yMTA3MTc3IDEzNCwxLjM0NzYyNTExIEMxMzQsMC45OTQ2NjkwODggMTMzLjk4NjcyMywwLjY0MzcwMTM4IDEzMy45NjA0NzIsMC4yOTQ5MTYxMTIgWiIgaWQ9InJlYWN0LXBhdGgtMjk3Ij48L3BhdGg+PC9kZWZzPjxnIGlkPSJTaGlydCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzIuMDAwMDAwLCAyOS4wMDAwMDApIj48bWFzayBpZD0icmVhY3QtbWFzay0yOTgiIGZpbGw9IndoaXRlIj48dXNlIHhsaW5rOmhyZWY9IiNyZWFjdC1wYXRoLTI5NyI+PC91c2U+PC9tYXNrPjx1c2UgaWQ9IkNsb3RoZXMiIGZpbGw9IiNFNkU2RTYiIHhsaW5rOmhyZWY9IiNyZWFjdC1wYXRoLTI5NyI+PC91c2U+PGcgaWQ9IkNvbG9yL1BhbGV0dGUvQmxhY2siIG1hc2s9InVybCgjcmVhY3QtbWFzay0yOTgpIiBmaWxsPSIjMjYyRTMzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMzIuMDAwMDAwLCAtMjkuMDAwMDAwKSIgaWQ9IvCflo1Db2xvciI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjI2NCIgaGVpZ2h0PSIxMTAiPjwvcmVjdD48L2c+PC9nPjxnIGlkPSJTaGFkb3d5IiBvcGFjaXR5PSIwLjU5OTk5OTk2NCIgbWFzaz0idXJsKCNyZWFjdC1tYXNrLTI5OCkiIGZpbGwtb3BhY2l0eT0iMC4xNiIgZmlsbD0iIzAwMDAwMCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjAuMDAwMDAwLCAtMjUuMDAwMDAwKSIgaWQ9IkhvbGEt8J+Ri/Cfj7wiPjxlbGxpcHNlIGN4PSI0MC41IiBjeT0iMjcuODQ3NjI1MSIgcng9IjM5LjYzNTEwNDciIHJ5PSIyNi45MTM4MjcyIj48L2VsbGlwc2U+PC9nPjwvZz48L2c+PGcgaWQ9IkJsYXplciIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMzIuMDAwMDAwLCAyOC4wMDAwMDApIj48cGF0aCBkPSJNNjguNzg0ODA3LDEuMTIyMjI4NDcgQzMwLjUxMjMxNywyLjgwNDA5NzM5IC0xLjg5NDg2NTU2ZS0xNCwzNC4zNjQ2NDM3IC0xLjQyMTA4NTQ3ZS0xNCw3My4wNTE3MjM1IEwwLDczLjA1MTcyMzUgTDAsODIgTDY5LjM2MTY3NjcsODIgQzY1Ljk2MDc0MTIsNjkuOTE5OTk0MSA2NCw1NS43MDg3Mjk2IDY0LDQwLjUgQzY0LDI2LjE3Mjk3MzYgNjUuNzM5OTg5MSwxMi43MzExMTE1IDY4Ljc4NDgwNywxLjEyMjIyODQ3IFogTTEzMS42MzgzMjMsODIgTDIwMCw4MiBMMjAwLDczLjA1MTcyMzUgQzIwMCwzNC43MDY3NjQxIDE3MC4wMjQ5NTQsMy4zNjI4NTE2NiAxMzIuMjI4NzE5LDEuMTczODQyMjUgQzEzNS4yNjUxNjMsMTIuNzcwOTQ2NCAxMzcsMjYuMTk0MjAxNiAxMzcsNDAuNSBDMTM3LDU1LjcwODcyOTYgMTM1LjAzOTI1OSw2OS45MTk5OTQxIDEzMS42MzgzMjMsODIgWiIgaWQ9IlNhY28iIGZpbGw9IiMzQTRDNUEiPjwvcGF0aD48cGF0aCBkPSJNMTQ5LDU4IEwxNTguNTU1ODUzLDUwLjgzMzExIEwxNTguNTU1ODUzLDUwLjgzMzExIEMxNTkuOTk4ODk3LDQ5Ljc1MDgyNzUgMTYxLjk4Nzc3OSw0OS43NjgyNzI1IDE2My40MTE2MTYsNTAuODc1NzAxMSBMMTcwLDU2IEwxNDksNTggWiIgaWQ9IlBvY2tldC1oYW5reSIgZmlsbD0iI0U2RTZFNiI+PC9wYXRoPjxwYXRoIGQ9Ik02OSwxLjEzNjg2ODM4ZS0xMyBDNjUsMTkuMzMzMzMzMyA2Ni42NjY2NjY3LDQ2LjY2NjY2NjcgNzQsODIgTDU4LDgyIEw0NCw0NiBMNTAsMzcgTDQ0LDMxIEw2MywxIEM2NS4wMjc2NTksMC4zNjkyMzg2MzcgNjcuMDI3NjU5LDAuMDM1OTA1MzAzNyA2OSwxLjEzNjg2ODM4ZS0xMyBaIiBpZD0iV2luZyIgZmlsbD0iIzJGNDM1MSI+PC9wYXRoPjxwYXRoIGQ9Ik0xNTEsMS4xMzY4NjgzOGUtMTMgQzE0NywxOS4zMzMzMzMzIDE0OC42NjY2NjcsNDYuNjY2NjY2NyAxNTYsODIgTDE0MCw4MiBMMTI2LDQ2IEwxMzIsMzcgTDEyNiwzMSBMMTQ1LDEgQzE0Ny4wMjc2NTksMC4zNjkyMzg2MzcgMTQ5LjAyNzY1OSwwLjAzNTkwNTMwMzcgMTUxLDEuMTM2ODY4MzhlLTEzIFoiIGlkPSJXaW5nIiBmaWxsPSIjMkY0MzUxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNDEuMDAwMDAwLCA0MS4wMDAwMDApIHNjYWxlKC0xLCAxKSB0cmFuc2xhdGUoLTE0MS4wMDAwMDAsIC00MS4wMDAwMDApICI+PC9wYXRoPjwvZz48L2c+PGcgaWQ9IkZhY2UiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDc2LjAwMDAwMCwgODIuMDAwMDAwKSIgZmlsbD0iIzAwMDAwMCI+PGcgaWQ9Ik1vdXRoL1NtaWxlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgyLjAwMDAwMCwgNTIuMDAwMDAwKSI+PGRlZnM+PHBhdGggZD0iTTM1LjExNzg0NCwxNS4xMjgwNzcyIEMzNi4xNzU3MTIxLDI0LjYxOTgwMjUgNDQuMjI1OTg3MywzMiA1NCwzMiBDNjMuODA0MjA1NSwzMiA3MS44NzQwMDc1LDI0LjU3NDEzNiA3Mi44OTE3NTkzLDE1LjA0MDA1NDYgQzcyLjk3MzY2ODUsMTQuMjcyNzQ2IDcyLjExNjc0MjksMTMgNzEuMDQyNzY3LDEzIEM1Ni4xNDg3NTM2LDEzIDQ0LjczNzkyMTMsMTMgMzcuMDg2ODI0NCwxMyBDMzYuMDA2NjE2OCwxMyAzNS4wMTIwMDU4LDE0LjE3ODQ0MzUgMzUuMTE3ODQ0LDE1LjEyODA3NzIgWiIgaWQ9InJlYWN0LXBhdGgtMzA1Ij48L3BhdGg+PC9kZWZzPjxtYXNrIGlkPSJyZWFjdC1tYXNrLTMwNiIgZmlsbD0id2hpdGUiPjx1c2UgeGxpbms6aHJlZj0iI3JlYWN0LXBhdGgtMzA1Ij48L3VzZT48L21hc2s+PHVzZSBpZD0iTW91dGgiIGZpbGwtb3BhY2l0eT0iMC42OTk5OTk5ODgiIGZpbGw9IiMwMDAwMDAiIGZpbGwtcnVsZT0iZXZlbm9kZCIgeGxpbms6aHJlZj0iI3JlYWN0LXBhdGgtMzA1Ij48L3VzZT48cmVjdCBpZD0iVGVldGgiIGZpbGw9IiNGRkZGRkYiIGZpbGwtcnVsZT0iZXZlbm9kZCIgbWFzaz0idXJsKCNyZWFjdC1tYXNrLTMwNikiIHg9IjM5IiB5PSIyIiB3aWR0aD0iMzEiIGhlaWdodD0iMTYiIHJ4PSI1Ij48L3JlY3Q+PGcgaWQ9IlRvbmd1ZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIG1hc2s9InVybCgjcmVhY3QtbWFzay0zMDYpIiBmaWxsPSIjRkY0RjZEIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzOC4wMDAwMDAsIDI0LjAwMDAwMCkiPjxjaXJjbGUgY3g9IjExIiBjeT0iMTEiIHI9IjExIj48L2NpcmNsZT48Y2lyY2xlIGN4PSIyMSIgY3k9IjExIiByPSIxMSI+PC9jaXJjbGU+PC9nPjwvZz48L2c+PGcgaWQ9Ik5vc2UvRGVmYXVsdCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjguMDAwMDAwLCA0MC4wMDAwMDApIiBmaWxsLW9wYWNpdHk9IjAuMTYiPjxwYXRoIGQ9Ik0xNiw4IEMxNiwxMi40MTgyNzggMjEuMzcyNTgzLDE2IDI4LDE2IEwyOCwxNiBDMzQuNjI3NDE3LDE2IDQwLDEyLjQxODI3OCA0MCw4IiBpZD0iTm9zZSI+PC9wYXRoPjwvZz48ZyBpZD0iRXllcy9IYXBweS3wn5iBIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgwLjAwMDAwMCwgOC4wMDAwMDApIiBmaWxsLW9wYWNpdHk9IjAuNTk5OTk5OTY0Ij48cGF0aCBkPSJNMTYuMTYwMTY3NCwyMi40NDczMTE2IEMxOC4wMDY2NzYsMTguNjQ4NTA4IDIyLjE2NDQyMjUsMTYgMjYuOTk3NTgwMywxNiBDMzEuODEzNjc2NiwxNiAzNS45NTkxMjE3LDE4LjYyOTg0MiAzNy44MTUzNTE4LDIyLjQwNzEyNDIgQzM4LjM2Njc2MDUsMjMuNTI5MTk3NyAzNy41ODIxMDM3LDI0LjQ0NzQ4MTcgMzYuNzkwNjA3LDIzLjc2NzAyMjggQzM0LjMzOTUwNjMsMjEuNjU5NzgzMyAzMC44NTg3MTYzLDIwLjM0Mzc4ODQgMjYuOTk3NTgwMywyMC4zNDM3ODg0IEMyMy4yNTcyMDYxLDIwLjM0Mzc4ODQgMTkuODczNzU4NCwyMS41Nzg3NTE5IDE3LjQzNzUzOTIsMjMuNTcxNjQxMiBDMTYuNTQ2NzkyOCwyNC4zMDAyOTQ0IDE1LjYyMDEwMTIsMjMuNTU4Mzg0NCAxNi4xNjAxNjc0LDIyLjQ0NzMxMTYgWiIgaWQ9IlNxdWludCI+PC9wYXRoPjxwYXRoIGQ9Ik03NC4xNjAxNjc0LDIyLjQ0NzMxMTYgQzc2LjAwNjY3NiwxOC42NDg1MDggODAuMTY0NDIyNSwxNiA4NC45OTc1ODAzLDE2IEM4OS44MTM2NzY2LDE2IDkzLjk1OTEyMTcsMTguNjI5ODQyIDk1LjgxNTM1MTgsMjIuNDA3MTI0MiBDOTYuMzY2NzYwNSwyMy41MjkxOTc3IDk1LjU4MjEwMzcsMjQuNDQ3NDgxNyA5NC43OTA2MDcsMjMuNzY3MDIyOCBDOTIuMzM5NTA2MywyMS42NTk3ODMzIDg4Ljg1ODcxNjMsMjAuMzQzNzg4NCA4NC45OTc1ODAzLDIwLjM0Mzc4ODQgQzgxLjI1NzIwNjEsMjAuMzQzNzg4NCA3Ny44NzM3NTg0LDIxLjU3ODc1MTkgNzUuNDM3NTM5MiwyMy41NzE2NDEyIEM3NC41NDY3OTI4LDI0LjMwMDI5NDQgNzMuNjIwMTAxMiwyMy41NTgzODQ0IDc0LjE2MDE2NzQsMjIuNDQ3MzExNiBaIiBpZD0iU3F1aW50Ij48L3BhdGg+PC9nPjxnIGlkPSJFeWVicm93L091dGxpbmUvRGVmYXVsdCIgZmlsbC1vcGFjaXR5PSIwLjU5OTk5OTk2NCI+PGcgaWQ9IkktQnJvd3NlIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMi4wMDAwMDAsIDYuMDAwMDAwKSI+PHBhdGggZD0iTTMuNjMwMjQ1MzYsMTEuMTU4NTc2NyBDNy41NDUxNTUwMSw1LjY0OTg2NjczIDE4LjI3NzkxOTcsMi41NjA4MzcyMSAyNy41MjMwMjY4LDQuODMxMTgwNDYgQzI4LjU5NTcyNDgsNS4wOTQ2MDU1IDI5LjY3ODg2NjUsNC40Mzg1NjAxMyAyOS45NDIyOTE2LDMuMzY1ODYyMTIgQzMwLjIwNTcxNjYsMi4yOTMxNjQxIDI5LjU0OTY3MTIsMS4yMTAwMjIzNiAyOC40NzY5NzMyLDAuOTQ2NTk3MzIgQzE3Ljc0MDM2MzMsLTEuNjkwMDE3ODkgNS4zMTIwOTk2MiwxLjg4Njk5ODMyIDAuMzY5NzU0NjM5LDguODQxNDIzMjYgQy0wLjI3MDEwOTYyNiw5Ljc0MTc4MjkxIC0wLjA1ODkzNjM5MTcsMTAuOTkwMzgxMSAwLjg0MTQyMzI2LDExLjYzMDI0NTQgQzEuNzQxNzgyOTEsMTIuMjcwMTA5NiAyLjk5MDM4MTEsMTIuMDU4OTM2NCAzLjYzMDI0NTM2LDExLjE1ODU3NjcgWiIgaWQ9IkV5ZWJyb3ciIGZpbGwtcnVsZT0ibm9uemVybyI+PC9wYXRoPjxwYXRoIGQ9Ik02MS42MzAyNDU0LDExLjE1ODU3NjcgQzY1LjU0NTE1NSw1LjY0OTg2NjczIDc2LjI3NzkxOTcsMi41NjA4MzcyMSA4NS41MjMwMjY4LDQuODMxMTgwNDYgQzg2LjU5NTcyNDgsNS4wOTQ2MDU1IDg3LjY3ODg2NjUsNC40Mzg1NjAxMyA4Ny45NDIyOTE2LDMuMzY1ODYyMTIgQzg4LjIwNTcxNjYsMi4yOTMxNjQxIDg3LjU0OTY3MTIsMS4yMTAwMjIzNiA4Ni40NzY5NzMyLDAuOTQ2NTk3MzIgQzc1Ljc0MDM2MzMsLTEuNjkwMDE3ODkgNjMuMzEyMDk5NiwxLjg4Njk5ODMyIDU4LjM2OTc1NDYsOC44NDE0MjMyNiBDNTcuNzI5ODkwNCw5Ljc0MTc4MjkxIDU3Ljk0MTA2MzYsMTAuOTkwMzgxMSA1OC44NDE0MjMzLDExLjYzMDI0NTQgQzU5Ljc0MTc4MjksMTIuMjcwMTA5NiA2MC45OTAzODExLDEyLjA1ODkzNjQgNjEuNjMwMjQ1NCwxMS4xNTg1NzY3IFoiIGlkPSJFeWVicm93IiBmaWxsLXJ1bGU9Im5vbnplcm8iIHRyYW5zZm9ybT0idHJhbnNsYXRlKDczLjAwMDE1NCwgNi4wMzkxOTgpIHNjYWxlKC0xLCAxKSB0cmFuc2xhdGUoLTczLjAwMDE1NCwgLTYuMDM5MTk4KSAiPjwvcGF0aD48L2c+PC9nPjwvZz48ZyBpZD0iVG9wIiBzdHJva2Utd2lkdGg9IjEiIGZpbGwtcnVsZT0iZXZlbm9kZCI+PGRlZnM+PHJlY3QgaWQ9InJlYWN0LXBhdGgtMjg3IiB4PSIwIiB5PSIwIiB3aWR0aD0iMjY0IiBoZWlnaHQ9IjI4MCI+PC9yZWN0PjxwYXRoIGQ9Ik0xODAuMTQ5OTgsMzkuOTIwNDA4MyBDMTc3LjM5MDIwNiwzNy4xMDAzOTg4IDE3NC4xODU5MTMsMzQuNzA2ODI5NyAxNzEuMDY5MjUyLDMyLjMwNjU1MDMgQzE3MC4zODE1NjYsMzEuNzc3NDQyIDE2OS42ODI4NDMsMzEuMjYxMDgzMyAxNjkuMDEwNTQ0LDMwLjcxMTg0NDEgQzE2OC44NTc2ODcsMzAuNTg3MDMyMyAxNjcuMjkxOTk5LDI5LjQ2NTczODggMTY3LjEwNDY5MSwyOS4wNTMwNTQ0IEMxNjYuNjUzODE2LDI4LjA2MDI2MzQgMTY2LjkxNTA0MiwyOC44MzMyOTE2IDE2Ni45NzcyNTUsMjcuNjQ4NTg1NyBDMTY3LjA1NTg1NywyNi4xNTA1MDggMTcwLjExMDY0LDIxLjkxOTMxOTQgMTY3LjgzMTE3NiwyMC45NDkwMDc5IEMxNjYuODI4NDEzLDIwLjUyMjIzMiAxNjUuMDM5NjI4LDIxLjY1Nzk1MjYgMTY0LjA3NzY3MSwyMi4wMzMwNTkyIEMxNjIuMTk2MjM1LDIyLjc2NzE2NzYgMTYwLjI5MTcyMSwyMy4zOTMyMzk5IDE1OC4zNDY3MzQsMjMuOTMzMDg0NyBDMTU5LjI3ODU4OCwyMi4wNzYzNDA3IDE2MS4wNTUzMzMsMTguMzU5NDk3NyAxNTcuNzE1OTEsMTkuMzU0MzAxOCBDMTU1LjExNDM0NSwyMC4xMjkzNDMxIDE1Mi42OTAwNTIsMjIuMTIxOTcwOSAxNTAuMDc1Nzc3LDIzLjA1OTQwMTggQzE1MC45NDA3MzUsMjEuNjQxNTEyNCAxNTQuMzk5OTAxLDE3LjI0NzkzNDEgMTUxLjI3NDIwOSwxNy4wMDIzMzY2IEMxNTAuMzAxNTQ5LDE2LjkyNTgzOSAxNDcuNDcxMjAxLDE4Ljc1MDM3MzUgMTQ2LjQyMzk1MiwxOS4xMzk1NzE3IEMxNDMuMjg3MjIzLDIwLjMwNTQ4ODggMTQwLjA4MzI2NCwyMS4wNTkwNTcxIDEzNi43ODk5OTksMjEuNjUyNTg0NCBDMTI1LjU5MjAzLDIzLjY3MDcxMTQgMTEyLjQ5NzIzOCwyMy4wOTUzMDE5IDEwMi4xMzY4LDI4LjE5MzQ2MzIgQzk0LjE0OTQ3OTYsMzIuMTIzNjk0MiA4Ni4yNjI1MDIsMzguMjIyMDI3OCA4MS42NDgzODYsNDUuOTg3NTM5IEM3Ny4yMDExNzQyLDUzLjQ3MjU1OSA3NS41Mzc4MTgsNjEuNjY0MTc1MSA3NC42MDY5NjczLDcwLjI0MTI5ODcgQzczLjkyMzk2NDQsNzYuNTM1OTA5IDczLjg2ODQ0MTIsODMuMDQyNTY1MiA3NC4xODc4NjcxLDg5LjM1OTk5MDUgQzc0LjI5MjIyNDEsOTEuNDI5Nzg2OSA3NC41MjUwMjAzLDEwMC45NzA4NDcgNzcuNTMxOTcyNCw5OC4wODEzODU5IEM3OS4wMzAwOTY3LDk2LjY0MTY4OCA3OS4wMTkwNTksOTAuODI4MjA3MyA3OS4zOTYzNDk1LDg4Ljg2MDQwNzYgQzgwLjE0NzI1MTMsODQuOTQ1Mjc0OCA4MC44NzAwNTcsODEuMDEyNjk1MSA4Mi4xMjIwMDYsNzcuMjIyNzA5NiBDODQuMzI4MjE5MSw3MC41NDM5MzM5IDg2LjkzMDc4NzksNjMuNDI5NjU4NyA5Mi40MjY5MjA5LDU4LjgyOTczODMgQzk1Ljk1Mzk4NTMsNTUuODc4MjA2NiA5OC40MzA3OTA2LDUxLjg4ODkyNDggMTAxLjgwNjAwMiw0OC45MTEyMjI5IEMxMDMuMzIyMTg4LDQ3LjU3Mzg1NzIgMTAyLjE2NTIzMSw0Ny43MTMwOTYzIDEwNC42MDI5MDIsNDcuODg4NTcxIEMxMDYuMjQwNTA0LDQ4LjAwNjMzNyAxMDcuODg1NDY0LDQ4LjA1MTI5NjEgMTA5LjUyNjQxLDQ4LjA5NDI0MjEgQzExMy4zMjIzOTQsNDguMTkyODgzNyAxMTcuMTI0Mzk5LDQ4LjE2NzcyIDEyMC45MjEzODcsNDguMTgxMTQwNyBDMTI4LjU2ODIxLDQ4LjIwODY1MyAxMzYuMTc5MjQzLDQ4LjMxNjY4OSAxNDMuODE4NzA4LDQ3LjkxNjQxODggQzE0Ny4yMTM2NTMsNDcuNzM4NTk1NSAxNTAuNjE3OTY1LDQ3LjY0MjMwMjQgMTU0LjAwMzg4LDQ3LjMyODI1OTcgQzE1NS44OTUzNDksNDcuMTUyNzg1IDE1OS4yNTE0OTYsNDUuOTQwNTY2OCAxNjAuODA4NDg4LDQ2Ljg2NjkyNTYgQzE2Mi4yMzMzNjIsNDcuNzE0NDM4MyAxNjMuNzEzMDksNTAuNDgxNzcxOSAxNjQuNzM2MjU3LDUxLjYxNTE0NCBDMTY3LjE1MzUyNSw1NC4yOTM1NjU5IDE3MC4wMzU3MTcsNTYuMzM5MjA1MiAxNzIuODYyMzg1LDU4LjUzNTQ5MTEgQzE3OC43NTY1NDcsNjMuMTE0OTQ1IDE4MS43MzIzOTIsNjguODY2NjkwOCAxODMuNTIyNTE1LDc2LjAyMzI0MSBDMTg1LjMwNTk0OSw4My4xNTMyODU0IDE4NC44MDU5MDUsODkuNzY4MTUgMTg3LjAxMzQ1Niw5Ni43ODQ3OSBDMTg3LjQwMTc4NCw5OC4wMTg0ODEzIDE4OC40Mjg5NjUsMTAwLjE0NDk4IDE4OS42OTUyOTYsOTguMjM4OTE1MSBDMTg5LjkzMDQzNCw5Ny44ODQ5NDYxIDE4OS44Njk1NTksOTUuOTM5MDI3NyAxODkuODY5NTU5LDk0LjgxOTMzOSBDMTg5Ljg2OTU1OSw5MC4yOTk1OTM0IDE5MS4wMTQxNDEsODYuOTA4Mzc3MiAxOTAuOTk5NzU4LDgyLjM1OTExOTcgQzE5MC45NDM1NjYsNjguNTI3MTQ4OSAxOTAuNDk2MzcsNTAuNDkwODMwOCAxODAuMTQ5OTgsMzkuOTIwNDA4MyBaIiBpZD0icmVhY3QtcGF0aC0yODYiPjwvcGF0aD48ZmlsdGVyIHg9Ii0wLjglIiB5PSItMi4wJSIgd2lkdGg9IjEwMS41JSIgaGVpZ2h0PSIxMDguMCUiIGZpbHRlclVuaXRzPSJvYmplY3RCb3VuZGluZ0JveCIgaWQ9InJlYWN0LWZpbHRlci0yODMiPjxmZU9mZnNldCBkeD0iMCIgZHk9IjIiIGluPSJTb3VyY2VBbHBoYSIgcmVzdWx0PSJzaGFkb3dPZmZzZXRPdXRlcjEiPjwvZmVPZmZzZXQ+PGZlQ29sb3JNYXRyaXggdmFsdWVzPSIwIDAgMCAwIDAgICAwIDAgMCAwIDAgICAwIDAgMCAwIDAgIDAgMCAwIDAuMTYgMCIgdHlwZT0ibWF0cml4IiBpbj0ic2hhZG93T2Zmc2V0T3V0ZXIxIiByZXN1bHQ9InNoYWRvd01hdHJpeE91dGVyMSI+PC9mZUNvbG9yTWF0cml4PjxmZU1lcmdlPjxmZU1lcmdlTm9kZSBpbj0ic2hhZG93TWF0cml4T3V0ZXIxIj48L2ZlTWVyZ2VOb2RlPjxmZU1lcmdlTm9kZSBpbj0iU291cmNlR3JhcGhpYyI+PC9mZU1lcmdlTm9kZT48L2ZlTWVyZ2U+PC9maWx0ZXI+PC9kZWZzPjxtYXNrIGlkPSJyZWFjdC1tYXNrLTI4NSIgZmlsbD0id2hpdGUiPjx1c2UgeGxpbms6aHJlZj0iI3JlYWN0LXBhdGgtMjg3Ij48L3VzZT48L21hc2s+PGcgaWQ9Ik1hc2siPjwvZz48ZyBpZD0iVG9wL1Nob3J0LUhhaXIvU2hvcnQtRmxhdCIgbWFzaz0idXJsKCNyZWFjdC1tYXNrLTI4NSkiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xLjAwMDAwMCwgMC4wMDAwMDApIj48bWFzayBpZD0icmVhY3QtbWFzay0yODQiIGZpbGw9IndoaXRlIj48dXNlIHhsaW5rOmhyZWY9IiNyZWFjdC1wYXRoLTI4NiI+PC91c2U+PC9tYXNrPjx1c2UgaWQ9IlNob3J0LUhhaXIiIHN0cm9rZT0ibm9uZSIgZmlsbD0iIzFGMzE0MCIgZmlsbC1ydWxlPSJldmVub2RkIiB4bGluazpocmVmPSIjcmVhY3QtcGF0aC0yODYiPjwvdXNlPjxnIGlkPSJTa2luL/Cfkbbwn4+9LTAzLUJyb3duIiBtYXNrPSJ1cmwoI3JlYWN0LW1hc2stMjg0KSIgZmlsbD0iIzJDMUIxOCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC4wMDAwMDAsIDAuMDAwMDAwKSAiIGlkPSJDb2xvciI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjI2NCIgaGVpZ2h0PSIyODAiPjwvcmVjdD48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L2c+PC9nPjwvZz48L3N2Zz4=' };
          setProfile(profile);
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    }
  }, []);

  return (
    profile && (
      <div className="flex flex-col items-center md:flex-row gap-2">
        <div className="rounded-full flex overflow-hidden border h-10 w-10">
          {profile.image ? (
            <img
              src={profile.image}
              width="auto"
              height="40"
              alt="Profile Image"
            />
          ) : (
            <FaRegUser style={{ width: "auto", height: "40" }} />
          )}
        </div>
        <div className="flex flex-row gap-2">
          <p className="my-auto text-xs lg:text-sm">
            Welcome, <b>{profile.name ?? ""}!</b>
          </p>
          <button onClick={() => {
            deleteCookie('access_token');
            deleteCookie('refresh_token');
            router.push("/auth/signin");
          }}>
            <LuLogOut />
          </button>
        </div>
      </div>
    )
  );
  
}