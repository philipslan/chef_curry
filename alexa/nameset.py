f = open('list_of_names', 'r')
output = open('names_unique', 'w')
s = set()
for line in f:
	if line not in s:
		s.add(line)
		output.write(line)
output.close()
f.close()