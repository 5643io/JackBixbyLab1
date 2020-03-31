default rel
section .text
global main
main:
label0:
mov rax, 1
cmp rax, 0
je label1
mov rax, 0
cmp rax, 0
je label2
mov rax, 1
ret
label2:
jmp label0
label1:
ret
section .data

