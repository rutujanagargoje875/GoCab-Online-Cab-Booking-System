import sys

# Dijkstra algorithm
def Dis(arr, s):
    def finder(dis, vis):
        minn = sys.maxsize
        minnVer = -1
        for i in range(len(dis)):
            if (not vis[i] and dis[i] < minn):
                minn = dis[i]
                minnVer = i
        return minnVer

    count = len(arr)
    vis = [False] * count
    dis = [sys.maxsize] * count
    dis[s] = 0

    for i in range(count):
        u = finder(dis, vis)
        if u == -1:
            break
        vis[u] = True
        for v in range(count):
            if (not vis[v] and arr[u][v] != 0 and (dis[u] + arr[u][v] < dis[v])):
                dis[v] = dis[u] + arr[u][v]

    print(dis[int(sys.argv[2])])


# ── 36-node Maharashtra district graph ──────────────────────
# Index map:
#  0=Ahmednagar   1=Akola        2=Amravati     3=Aurangabad
#  4=Beed         5=Bhandara     6=Buldhana     7=Chandrapur
#  8=Dhule        9=Gadchiroli  10=Gondia      11=Hingoli
# 12=Jalgaon     13=Jalna       14=Kolhapur    15=Latur
# 16=Mumbai City 17=Mumbai Sub  18=Nagpur      19=Nanded
# 20=Nandurbar   21=Nashik      22=Osmanabad   23=Palghar
# 24=Parbhani    25=Pune        26=Raigad      27=Ratnagiri
# 28=Sangli      29=Satara      30=Sindhudurg  31=Solapur
# 32=Thane       33=Wardha      34=Washim      35=Yavatmal

n = 36
arr = [[0] * n for _ in range(n)]

def addEdge(a, b, w):
    arr[a][b] = w
    arr[b][a] = w

addEdge(0,  3,  120)  # Ahmednagar  – Aurangabad
addEdge(0,  4,   90)  # Ahmednagar  – Beed
addEdge(0, 21,  110)  # Ahmednagar  – Nashik
addEdge(0, 25,   90)  # Ahmednagar  – Pune
addEdge(0, 31,  150)  # Ahmednagar  – Solapur
addEdge(1,  2,   60)  # Akola       – Amravati
addEdge(1,  6,   80)  # Akola       – Buldhana
addEdge(1, 11,  100)  # Akola       – Hingoli
addEdge(1, 34,   70)  # Akola       – Washim
addEdge(2,  7,  150)  # Amravati    – Chandrapur
addEdge(2, 18,  120)  # Amravati    – Nagpur
addEdge(2, 33,   90)  # Amravati    – Wardha
addEdge(2, 35,  110)  # Amravati    – Yavatmal
addEdge(3,  4,  100)  # Aurangabad  – Beed
addEdge(3, 12,  130)  # Aurangabad  – Jalgaon
addEdge(3, 13,   60)  # Aurangabad  – Jalna
addEdge(3, 21,  140)  # Aurangabad  – Nashik
addEdge(3, 24,   90)  # Aurangabad  – Parbhani
addEdge(4, 15,  120)  # Beed        – Latur
addEdge(4, 22,  100)  # Beed        – Osmanabad
addEdge(5,  7,   80)  # Bhandara    – Chandrapur
addEdge(5, 10,   60)  # Bhandara    – Gondia
addEdge(5, 18,   90)  # Bhandara    – Nagpur
addEdge(6,  8,  150)  # Buldhana    – Dhule
addEdge(6, 12,  120)  # Buldhana    – Jalgaon
addEdge(7,  9,   90)  # Chandrapur  – Gadchiroli
addEdge(7, 33,  110)  # Chandrapur  – Wardha
addEdge(8, 12,   80)  # Dhule       – Jalgaon
addEdge(8, 20,  100)  # Dhule       – Nandurbar
addEdge(8, 21,  120)  # Dhule       – Nashik
addEdge(9, 10,   70)  # Gadchiroli  – Gondia
addEdge(10, 18, 130)  # Gondia      – Nagpur
addEdge(11, 13,  90)  # Hingoli     – Jalna
addEdge(11, 19,  80)  # Hingoli     – Nanded
addEdge(11, 24,  70)  # Hingoli     – Parbhani
addEdge(12, 21, 100)  # Jalgaon     – Nashik
addEdge(13, 24,  80)  # Jalna       – Parbhani
addEdge(14, 27, 120)  # Kolhapur    – Ratnagiri
addEdge(14, 28,  80)  # Kolhapur    – Sangli
addEdge(14, 30, 150)  # Kolhapur    – Sindhudurg
addEdge(15, 19, 110)  # Latur       – Nanded
addEdge(15, 22,  70)  # Latur       – Osmanabad
addEdge(15, 31, 100)  # Latur       – Solapur
addEdge(16, 17,  30)  # Mumbai City – Mumbai Suburban
addEdge(16, 32,  40)  # Mumbai City – Thane
addEdge(17, 23,  60)  # Mumbai Sub  – Palghar
addEdge(17, 26,  90)  # Mumbai Sub  – Raigad
addEdge(17, 32,  50)  # Mumbai Sub  – Thane
addEdge(18, 33,  80)  # Nagpur      – Wardha
addEdge(19, 24,  90)  # Nanded      – Parbhani
addEdge(20, 21, 130)  # Nandurbar   – Nashik
addEdge(21, 23, 120)  # Nashik      – Palghar
addEdge(21, 25, 160)  # Nashik      – Pune
addEdge(22, 31,  80)  # Osmanabad   – Solapur
addEdge(23, 32,  70)  # Palghar     – Thane
addEdge(25, 26, 100)  # Pune        – Raigad
addEdge(25, 28, 170)  # Pune        – Sangli
addEdge(25, 29, 110)  # Pune        – Satara
addEdge(25, 31, 180)  # Pune        – Solapur
addEdge(26, 27, 100)  # Raigad      – Ratnagiri
addEdge(26, 32,  60)  # Raigad      – Thane
addEdge(27, 29, 130)  # Ratnagiri   – Satara
addEdge(27, 30,  90)  # Ratnagiri   – Sindhudurg
addEdge(28, 29,  80)  # Sangli      – Satara
addEdge(28, 31, 120)  # Sangli      – Solapur
addEdge(33, 35, 100)  # Wardha      – Yavatmal
addEdge(34, 35,  80)  # Washim      – Yavatmal

Dis(arr, int(sys.argv[1]))
