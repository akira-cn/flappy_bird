define(function(require, exports, module){

function str_to_arr(value){
    return value.trim().split(/\s*,\s*/).map(function(o){return parseInt(o)});
}

function camelize(s) {
    return s.replace(/\-(\w)/ig, function(a, b) {
        return b.toUpperCase();
    });
}

function color_to_cxb(str){
    if(typeof str !== 'string'){
        return str;
    }

    str = str.trim();
    var values = [0, 0, 0];
    if(str[0] === '#'){
        str = str.slice(1);
        if(str.length === 3){
            str = str.replace(/(\w)/g, '$1$1');
        }
        values = str.match(/\w\w/g).map(function(o){
            return parseInt(o, 16);
        });
        return cc.c3b.apply(null, values);
    }else if(str.slice(0, 4) === 'rgb('){
        str = str.slice(4, -1);
        values = str_to_arr(str);
        return cc.c3b.apply(null, values);
    }else if(str.slice(0, 5) === 'rgba('){
        str = str.slice(5, -1);
        values = str_to_arr(str);
        return cc.c4b.apply(null, values);
    }
}

var styleMap = {
    /**
        anchor: 0.5,0.5
     */
    anchor: {
        set: function(node, value){
            if(node && node.setAnchorPoint){
                if(typeof value == 'string'){
                    value = str_to_arr(value);
                }
                if(typeof value == 'number'){
                    value = [value, value];
                }
                if(value instanceof Array){
                    value = cc.p.apply(null, value);
                }
                node.setAnchorPoint(value);
                return true;
            }
            return false;
        },
        get: function(node){
            if(node && node.getAnchorPoint){
                return node.getAnchorPoint();
            }
        }
    },
    /**
        texture: 'xxx.png'
        texture: 'xxx.png rect(0,0,a,b)'
     */
    texture: {
        set: function(node, value){
            if(value instanceof cc.Texture2D){
                var size = value.getContentSize();
                node.setTextureRect(cc.rect(0, 0, size.width, size.height));
                node.setTexture(value);
            }
            value = value.trim();
            var matches = value.match(/(.*)\s*(?:rect\((.*)\))/);
            var rect = null;
            if(matches){
                value = matches[1].trim();
                rect = str_to_arr(matches[2]);
                rect = cc.rect.apply(null, rect);
            }
            var spriteFrame = value && cc.SpriteFrameCache.getInstance().getSpriteFrame(value);
            if(spriteFrame){
                node.setDisplayFrame(spriteFrame);
                return true;
            }else{
                var texture = cc.TextureCache.getInstance().addImage(value);
                var width = node.getTextureRect().width;

                if(width <= 0){
                    if(rect) node.initWithTexture(texture, rect);
                    else node.initWithTexture(texture);
                }else {
                    if(rect) node.setTextureRect(rect);
                    node.setTexture(texture);
                }
                return true;
            }
        },
        get: function(node){
            return node.getTexture();
        }
    },
    /**
        position: "10,20"
     */
    position: {
        set: function(node, value){
            if(node && node.setPosition){
                if(typeof value == 'string'){
                    value = str_to_arr(value);
                }
                if(value instanceof Array){
                    value = cc.p.apply(null, value);
                }
                node.setPosition(value);
                return true;                
            }
            return false;
        },
        get: function(node){
            if(node && node.getPosition){
                return node.getPosition();
            }
        }
    },

    positionX: {
        set: function(node, value){
            var pos = node.getPosition();
            return  StyleManager.setStyle(node, 'position', cc.p(value, pos.y));
        },
        get: function(){
            if(node && node.getPosition){
                return node.getPosition().x;
            }            
        }
    },

    positionY: {
        set: function(node, value){
            var pos = node.getPosition();
            return  StyleManager.setStyle(node, 'position', cc.p(pos.x, value));
        },
        get: function(){
            if(node && node.getPosition){
                return node.getPosition().y;
            }            
        }
    },

    /**
        size: "480, 800"
     */
    size: {
        set: function(node, value){
            if(node && node.setContentSize){
                if(typeof value == 'string'){
                    value = str_to_arr(value);
                }
                if(value instanceof Array){
                    value = cc.size.apply(null, value);
                }                
                node.setContentSize(value);
                if(node.setDimensions){
                    node.setDimensions(value);
                }
                return true;
            }
            return false;
        },
        get: function(node){
            if(node && node.getContentSize){
                return node.getContentSize();
            }            
        }
    },

    /**
        width: 400
     */
    width: {
        set: function(node, value){
            var size = node.getContentSize();
            return StyleManager.setStyle(node, 'size', cc.size(value, size.height));
        },
        get: function(node){
            if(node && node.getContentSize){
                return node.getContentSize().width;
            }
        }
    },

    height: {
        set: function(node, value){
            var size = node.getContentSize();
            return StyleManager.setStyle(node, 'size', cc.size(size.width, value));         
        },
        get: function(node){
            if(node && node.getContentSize){
                return node.getContentSize().height;
            }            
        }
    },

    zOrder: {
        set: function(node, value){
            if(node && node.setZOrder){
                node.setZOrder(value);
                return true;
            }
            return false;
        },
        get: function(node){
            if(node && node.getZOrder){
                return node.getZOrder();
            }
        }
    },
    /**
        color: "#000"
        color: "#00ff00"
        color: "rgb(0,0,0)"
        color: "rgba(0,0,0,128)"
     */
    color: {
        set: function(node, value){
            if(node && node.setColor){
                value = color_to_cxb(value);
                node.setColor(value);
                return true;
            }
            return false;
        },
        get: function(node){
            if(node && node.getColor){
                return node.getColor();
            }
        }
    },

    /**
        fontFamily: "Times New Roman"
        font-family: "Times New Roman"
     */
    fontFamily : {
        set: function(node, value){
            if(node && node.setFontName){
                node.setFontName(value);
                return true;
            }
            return false;
        },
        get: function(node){
            if(node && node.getFontName){
                return node.getFontName();
            }
        }
    },

    fontSize: {
        set: function(node, value){
            if(node && node.setFontSize){
                node.setFontSize(value);
                return true;
            }
            return false;
        },
        get: function(node){
            if(node && node.getFontSize){
                return node.getFontSize();
            }
        }
    },
    
    textAlign: {
        set: function(node, value){
            if(node && node.setHorizontalAlignment){
                var map = {
                    "center": cc.TEXT_ALIGNMENT_CENTER,
                    "left":   cc.TEXT_ALIGNMENT_LEFT,
                    "right":  cc.TEXT_ALIGNMENT_RIGHT
                };
                if(typeof value === "string"){
                    value = map[value];
                }
                node.setHorizontalAlignment(value);
                return true;
            }
            return false;
        },
        get: function(node){
            if(node && node.getHorizontalAlignment){
                return node.getHorizontalAlignment();
            }
        }
    },

    vAlign: {
        set: function(node, value){
            if(node && node.setVerticalAlignment){
                var map = {
                    "middle": cc.VERTICAL_TEXT_ALIGNMENT_CENTER,
                    "top":    cc.VERTICAL_TEXT_ALIGNMENT_TOP,
                    "bottom": cc.VERTICAL_TEXT_ALIGNMENT_BOTTOM
                };
                if(typeof value === "string"){
                    value = map[value];
                }
                node.setVerticalAlignment(value);
                return true;
            }
            return false;
        },
        get: function(node){
            if(node && node.getVerticalAlignment){
                return node.getVerticalAlignment();
            }
        }
    },
    /**
        opacity: 128
     */
    opacity: {
        set: function(node, value){
            if(node && node.setOpacity){
                node.setOpacity(value);
                return true;
            }
            return false;
        },
        get: function(node){
            if(node && node.getOpacity){
                return node.getOpacity();
            }
        }
    },

    scale: {
        set: function(node, value){
            if(node && node.setScale){
                if(typeof value == 'string'){
                    value = str_to_arr(value);
                }
                if(value instanceof Array){
                    node.setScale.apply(node, value);
                }else{
                    node.setScale(value);
                }
                return true;
            }
            return false;
        },
        get: function(node){
            if(node && node.getScale){
                return node.getScale();
            }            
        }
    },

    scaleX: {
        set: function(node, value){
            if(node && node.setScaleX){
                node.setScaleX(value);
                return true;
            }
            return false;
        },
        get: function(node, value){
            if(node && node.getScaleX){
                return node.getScaleX();
            }
        }
    },

    scaleY: {
        set: function(node, value){
            if(node && node.setScaleY){
                node.setScaleY(value);
                return true;
            }
            return false;
        },
        get: function(node, value){
            if(node && node.getScaleY){
                return node.getScaleY();
            }
        }
    },

    rotate: {
        set: function(node, value){
            if(node && node.setRotation){
                node.setRotation(value);
                return true;
            }
        },
        get: function(node){
            if(node && node.getRotation){
                return node.getRotation();
            }
        }
    }
};

var styleMapKeyMap = {
    'zIndex' : 'zOrder',
    'xy' : 'position',
    'x' : 'positionX',
    'y' : 'positionY',
    'wh' : 'size',
    'w' : 'width',
    'h' : 'height'
};

var StyleManager = {
    setStyle: function(node, key, value){
        if(typeof key === 'object'){
            for(var i in key){
                this.setStyle(node, i, key[i]);
            }
        }else{
            key = camelize(key);
            key = styleMapKeyMap[key] || key;

            if(!styleMap[key]){
                var setter = node[camelize('set-'+key)];
                if(setter){
                    try{
                        setter.call(node, value);
                        return true;
                    }catch(ex){
                        return false;
                    }
                }
                return false;
            }

            return styleMap[key].set(node, value);
        }
    },
    getStyle: function(node, key){
        key = camelize(key);
        key = styleMapKeyMap[key] || key;        
        
        if(!styleMap[key]){
            var getter = node[camelize('get-'+key)];
            if(getter){
                try{
                    return getter.call(node);
                }catch(ex){
                    return null;
                }
            }
            return null;
        }
        return styleMap[key].get(node);
    }
}

cc.Node.prototype.setStyle = function(key, value){
    StyleManager.setStyle(this, key, value);
}
cc.Node.prototype.getStyle = function(key, value){
    return StyleManager.getStyle(this, key);
}

module.exports = {
    StyleManager: StyleManager
};
});