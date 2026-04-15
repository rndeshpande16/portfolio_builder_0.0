n = int(input())
 
for _ in range(n):
    num = bin(int(input()))[2:]
    if num == num[::-1]:
        print("YES")
        continue
    k = "1" + num
    l = "0" + num
    if k == k[::-1]:
        if l == l[::-1]:
            print("YES")
            continue
        else:
            print("NO")
            continue
    print("NO")