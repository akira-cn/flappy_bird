LOCAL_PATH := $(call my-dir)

include $(CLEAR_VARS)

LOCAL_CPPFLAGS+= -fexceptions

LOCAL_MODULE := cqwrap_static

LOCAL_MODULE_FILENAME := libcqwrap

LOCAL_SRC_FILES :=  \
	./src/pattern/CustEvent.cpp \
	./src/scripting/cqwrap_misc_manual.cpp \
	./src/util/NativeAdapter.cpp \
	./src/util/MessageDelegate.cpp \
	./src/util/md5.cpp

LOCAL_WHOLE_STATIC_LIBRARIES := cocos2dx_static 
LOCAL_WHOLE_STATIC_LIBRARIES += cocosdenshion_static 
LOCAL_WHOLE_STATIC_LIBRARIES += cocos_extension_static 
LOCAL_WHOLE_STATIC_LIBRARIES += chipmunk_static 
LOCAL_WHOLE_STATIC_LIBRARIES += spidermonkey_static 
LOCAL_WHOLE_STATIC_LIBRARIES += scriptingcore-spidermonkey

LOCAL_SHARED_LIBRARIES += libwebsockets_shared

LOCAL_C_INCLUDES := $(LOCAL_PATH)/src 

LOCAL_EXPORT_C_INCLUDES := $(LOCAL_PATH)/src \
	$(LOCAL_PATH)/src/scripting \
	$(LOCAL_PATH)/src/util \
	$(LOCAL_PATH)/src/pattern

LOCAL_EXPORT_CFLAGS += -DCOCOS2D_JAVASCRIPT

include $(BUILD_STATIC_LIBRARY)

$(call import-module,cocos2dx)
$(call import-module,CocosDenshion/android)
$(call import-module,extensions)
$(call import-module,external/chipmunk)
$(call import-module,scripting/javascript/spidermonkey-android)
$(call import-module,scripting/javascript/bindings)
