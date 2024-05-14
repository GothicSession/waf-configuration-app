local summary = require "summary"
local status = require "status"
local cookie = require "cookie"
local WafServiceConfig = require "WafServiceConfig"
local encrypt_seed = require "encrypt_seed"
local json = require "json"
local util = require "util"

local _M = {}

_M.url_route = {}
_M.mime_type = {}
_M.mime_type['.js'] = "application/x-javascript"
_M.mime_type['.css'] = "text/css"
_M.mime_type['.html'] = "text/html"


function _M.filter()
    local method = ngx.req.get_method()
    local uri = ngx.var.uri
    local base_uri = WafServiceConfig.configs['base_uri']
    local dashboard_host = WafServiceConfig.configs['dashboard_host']

    if dashboard_host ~= '' then
        if ngx.var.host ~= dashboard_host then
            return
        end
    end

    if string.find( uri, base_uri ) == 1 then
        local path = string.sub( uri, string.len( base_uri ) + 1 )

        for i,item in ipairs( _M.route_table ) do
            if method == item['method'] and path == item['path'] then
                ngx.header.content_type = "application/json"
                ngx.header.charset = "utf-8"

                if item['auth'] == true and _M.check_session() == false then
                    local info = json.encode({["ret"]="failed",["message"]="need login"})
                    ngx.status = 400
                    ngx.say( info )
                else
                    ngx.say( item['handle']() )
                end
                ngx.exit( ngx.HTTP_OK )
            end
        end

        ngx.req.set_uri( path )
        ngx.var.vn_static_root = WafServiceConfig.home_path() .."/frontend/dist/waf-configuration-app/browser"
        ngx.var.vn_exec_flag = '1'-- use the var as a mark, so that lua can know that's a inside redirect
        util.ngx_ctx_dump()
        return ngx.exec('@vn_static') -- will jump out at the exec
    end
end

function _M.check_session()
    local cookie_obj, err = cookie:new()
    if not cookie_obj then
        ngx.log(ngx.ERR, "Failed to instantiate cookie object: ", err)
        return false
    end

    local fields = cookie_obj:get_all()
    if not fields then
        ngx.log(ngx.ERR, "No cookies found")
        return false
    end

    local cookie_prefix = WafServiceConfig.configs['cookie_prefix']
    local user = fields[cookie_prefix .. '_user']
    local session = fields[cookie_prefix .. '_session']

    ngx.log(ngx.ERR, "User: " .. (user or "nil"))
    ngx.log(ngx.ERR, "Session: " .. (session or "nil"))

    if not user or not session then
        ngx.log(ngx.ERR, "User or session cookie is nil")
        return false
    end

    local fixed_seed = "fixed_seed_value" -- Используйте фиксированное значение для отладки
    local expected_session = ngx.md5(fixed_seed .. user)
    ngx.log(ngx.ERR, "Expected session: " .. expected_session)

    if session == expected_session then
        ngx.log(ngx.ERR, "Session is valid for user: " .. user)
        return true
    else
        ngx.log(ngx.ERR, "Invalid session for user: " .. user)
        ngx.log(ngx.ERR, "Expected: " .. expected_session .. ", got: " .. session)
        return false
    end
end

function _M.login()
    local args = util.get_request_args()

    for i,v in ipairs(WafServiceConfig.configs['admin']) do
        if v['user'] == args['user'] and v['password'] == args["password"] and v['enable'] == true then
            local cookie_prefix = WafServiceConfig.configs['cookie_prefix']
            local fixed_seed = "fixed_seed_value" -- Используйте фиксированное значение для отладки
            local session = ngx.md5(fixed_seed .. v['user'])

            local data = {}
            data['ret'] = 'success'
            data['cookies'] = {
                [cookie_prefix .. '_session'] = session,
                [cookie_prefix .. '_user'] = v['user'],
            }
            return json.encode(data)
        end
    end

    ngx.status = 400
    return json.encode({["ret"]="failed",["message"]="Username and password not match"})
end

_M.route_table = {
    { ['method'] = "POST", ['auth']= false, ["path"] = "/login", ['handle'] = _M.login },
    { ['method'] = "GET",  ['auth']= true,  ["path"] = "/summary", ['handle'] = summary.report },
    { ['method'] = "GET",  ['auth']= true,  ["path"] = "/status", ['handle'] = status.report },
    { ['method'] = "POST",  ['auth']= true,  ["path"] = "/status/clear", ['handle'] = summary.clear },
    { ['method'] = "GET",  ['auth']= true,  ["path"] = "/config", ['handle'] = WafServiceConfig.report },
    { ['method'] = "POST", ['auth']= true,  ["path"] = "/config", ['handle'] = WafServiceConfig.set },
    { ['method'] = "GET",  ['auth']= true,  ["path"] = "/loadconfig", ['handle'] = WafServiceConfig.load_from_file },
}



return _M
