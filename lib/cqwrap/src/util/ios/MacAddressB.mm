#include "MacAddressB.h"
#include "OpenUDID.h"
//#include "MacAddress.h"
//#include <openssl/md5.h>

CCString* MacAddressB::getMacAddressB(){
    NSString* openUDID = [OpenUDID value];
    CCString* c = CCString::create([openUDID UTF8String]);
    return c;
}