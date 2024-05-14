local _M = {}


local WafServiceConfig = require "WafServiceConfig"
local request_tester = require "request_tester"


function scheme_judge(uri)
    local ngx_re_find  = ngx.re.find
    local matcher_list = WafServiceConfig.configs['matcher']

    for i, rule in ipairs( WafServiceConfig.configs["scheme_lock_rule"] ) do
        local enable = rule['enable']
        local matcher = matcher_list[ rule['matcher'] ]
        if enable == true and request_tester.test( matcher ) == true then
            return rule['scheme']
        end
    end
    return 'none'
end

function _M.run()

    if WafServiceConfig.configs["scheme_lock_enable"] ~= true then
        return
    end

    local ngx_var = ngx.var
    local scheme = scheme_judge( ngx_var.uri )
    if scheme == "none" or scheme == ngx_var.scheme then
        return
    end

    -- Used on WafServiceConfig behind Proxy situation
    if scheme == ngx.req.get_headers()["X-Forwarded-Proto"] then
        -- ngx.log(ngx.STDERR, "Compare the protocol from more frontend level proxy, ", ngx.req.get_headers()["X-Forwarded-Protol"])
        return
    end

    if ngx_var.args ~= nil then
        ngx.redirect( scheme.."://"..ngx_var.host..ngx_var.uri.."?"..ngx_var.args , ngx.HTTP_MOVED_TEMPORARILY)
    else
        ngx.redirect( scheme.."://"..ngx_var.host..ngx_var.uri , ngx.HTTP_MOVED_TEMPORARILY)
    end
end

return _M
