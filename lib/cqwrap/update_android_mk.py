#!/usr/bin/python
# -*- coding: utf-8 -*-

'''
这个文件用来更新android.mk中对文件的依赖关系
主要影响 LOCAL_SRC_FILES 和 LOCAL_C_INCLUDES 两个属性
使用方法： 将这个文件copy到 Game/proj.android/jin 目录下运行
使用时会backup原有的.mk文件
'''

import shutil
import os
import os.path
from time import time

mkfile = "./Android.mk"
mkfile_bak = mkfile + str(time()) + ".bak"
classes_dir = "./src"

def backup(mkfile):
	shutil.copyfile(mkfile, mkfile_bak)

def makeVars(path):
	local_src_files = "LOCAL_SRC_FILES :=  \\"
	#local_c_includes = "LOCAL_C_INCLUDES := $(LOCAL_PATH)/../../Classes \\"
	for root,dirs,files in os.walk(path):
		for file in files:
			ext = os.path.splitext(file)[1]
			if ext == ".cpp" or ext == ".c":
				#print os.path.join(root,file)
				local_src_files += "\n\t" + os.path.join(root,file).replace("\\", "/") + " \\";
		#for dir in dirs:
			#local_c_includes += "\n\t$(LOCAL_PATH)/" + os.path.join(root,dir).replace("\\", "/") + " \\";

	return local_src_files[:-1] + "\n\n" # + local_c_includes[:-1] + "\n\n"
	 

def updateMKFile(mkfile):
	backup(mkfile) 

	status = "READING"

	f = open(mkfile_bak)
	t = open(mkfile, "w")
	line = f.readline()

	content = ""

	while line:
		#print line
		if line.startswith("LOCAL_SRC_FILES"):
			status = "SKIPPING"
		if line.startswith("LOCAL_WHOLE_STATIC_LIBRARIES :="):
			status = "READING"
			content += makeVars(classes_dir)
		if status != "SKIPPING":
			content += line

		line = f.readline()

	t.write(content)
	t.close()
	f.close()

if __name__ == "__main__":
	updateMKFile(mkfile)