def check_intersection(k1, b1, x_new, y_new, x_old, y_old, lines_array):  # k1 b1 - коэффы прямой с точками в x_new, y new, x old, y old
# (прямая которая должна пересекаться с полосками)
    for i in range(0, len(lines_array), 4):
        x1, y1, x2, y2 = lines_array[i], lines_array[i + 1], lines_array[i + 2], lines_array[i + 3]
        k2 = (y2 - y1) / (x2 - x1)
        b2 = y1 - k2 * x1
        if k1 != k2:
            x_inter = (b2 - b1) / (k1 - k2)
            y_inter = k1 * x_inter + b1
            if min(x1, x2) <= x_inter <= max(x1, x2) and min(y1, y2) <= y_inter <= max(y1, y2):
                if min(x_old, x_new) <= x_inter <= max(x_old, x_new) and min(y_old, y_new) <= y_inter <= max(y_old, y_new):
                    return True
                else:
                    return False
            else:
                return False
        else:
            return False
