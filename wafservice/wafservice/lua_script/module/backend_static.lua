local _M = {}

local WafServiceConfig = require "WafServiceConfig"
local request_tester = require "request_tester"
local util = require "util"

function _M.filter()

    if WafServiceConfig.configs["static_file_enable"] ~= true then
        return
    end

    local matcher_list = WafServiceConfig.configs['matcher']
    for i, rule in ipairs( WafServiceConfig.configs["static_file_rule"] ) do
        local enable = rule['enable']
        local matcher = matcher_list[ rule['matcher'] ]
        if enable == true and request_tester.test( matcher ) == true then
            ngx.var.vn_static_root = rule['root']
            ngx.var.vn_static_expires = rule['expires']
            ngx.var.vn_exec_flag = '1'-- use the var as a mark, so that lua can know that's a inside redirect
            util.ngx_ctx_dump()
            return ngx.exec('@vn_static') -- will jump out at the exec
        end
    end
end

return _M
