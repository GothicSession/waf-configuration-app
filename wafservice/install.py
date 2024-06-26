import os
import sys
import getopt
import filecmp

openresty_pkg_url = 'https://openresty.org/download/openresty-1.15.8.1.tar.gz'
openresty_pkg = 'openresty-1.15.8.1.tar.gz'

work_path = os.getcwd()

def install_openresty():
    if os.path.exists('/opt/wafservice/WafService'):
        print("Seems that a old version of WafService was installed in /opt/wafservice/...\nBefore install, please delete it and backup the configs if you need.")
        sys.exit(1)

    # makesure the dir is clean
    print('### makesure the work directory is clean')
    exec_sys_cmd('rm -rf ' + openresty_pkg.replace('.tar.gz', ''))

    # download openresty
    down_flag = True
    if os.path.exists('./' + openresty_pkg):
        ans = ''
        while ans not in ['y', 'n']:
            ans = common_input(' Found %s in current directory, use it?(y/n)' % openresty_pkg)
        if ans == 'y':
            down_flag = False

    if down_flag:
        print('### start download openresty package...')
        exec_sys_cmd('rm -rf ' + openresty_pkg)
        exec_sys_cmd('wget ' + openresty_pkg_url)
    else:
        print('### use local openresty package...')

    print('### release the package ...')
    exec_sys_cmd('tar -xzf ' + openresty_pkg)

    # configure && compile && install openresty
    print('### configure openresty ...')
    os.chdir(openresty_pkg.replace('.tar.gz', ''))
    exec_sys_cmd('./configure --prefix=/opt/wafservice/openresty --user=nginx --group=nginx --with-http_v2_module --with-http_sub_module --with-http_stub_status_module --with-luajit')

    print('### compile openresty ...')
    exec_sys_cmd('make')

    print('### install openresty ...')
    exec_sys_cmd('make install')

def install_wafservice():
    # Install WafService files
    print('### copy WafService files ...')
    os.chdir(work_path)
    if not os.path.exists('/opt/wafservice/'):
        exec_sys_cmd('mkdir -p /opt/wafservice')

    exec_sys_cmd('cp -r -f ./wafservice /opt/wafservice')

    # Copy nginx config file to openresty
    if os.path.exists('/opt/wafservice/openresty'):
        if filecmp.cmp('/opt/wafservice/openresty/nginx/conf/nginx.conf', '/opt/wafservice/openresty/nginx/conf/nginx.conf.default', False):
            print('cp nginx config file to openresty')
            exec_sys_cmd('cp -f ./nginx.conf /opt/wafservice/openresty/nginx/conf/')
    else:
        print('openresty not found, so not copying nginx.conf')

    # Ensure the configs directory exists
    configs_path = '/opt/wafservice/wafservice/configs'
    if not os.path.exists(configs_path):
        exec_sys_cmd('mkdir -p ' + configs_path)

    # Set permissions for the configs directory
    exec_sys_cmd('chmod -R 777 ' + configs_path)

def update_wafservice():
    install_wafservice()

def exec_sys_cmd(cmd, accept_failed=False):
    print(cmd)
    ret = os.system(cmd)
    if ret != 0:
        if not accept_failed:
            print(f'*** The installing stopped because something was wrong. Command: {cmd} failed with exit code {ret}')
            exit(1)
    return ret

def common_input(s):
    if sys.version_info[0] == 3:
        return input(s)
    else:
        return raw_input(s)

def safe_pop(l):
    if len(l) == 0:
        return None
    else:
        return l.pop(0)

def show_help_and_exit():
    help_doc = ('usage: install.py <cmd> <args> ... \n\n'
                'install cmds and args:\n'
                '    install\n'
                '        all        :  install wafservice and openresty(default)\n'
                '        openresty  :  install openresty\n'
                '        wafservice :  install wafservice\n'
                '    update\n'
                '        wafservice  :  update the installed wafservice\n'
                )
    print(help_doc)
    exit()

if __name__ == '__main__':
    opts, args = getopt.getopt(sys.argv[1:], '', [])

    cmd = safe_pop(args)
    if cmd == 'install':
        cmd = safe_pop(args)
        if cmd == 'all' or cmd is None:
            install_openresty()
            install_wafservice()
        elif cmd == 'openresty':
            install_openresty()
        elif cmd == 'wafservice':
            install_wafservice()
        else:
            show_help_and_exit()
    elif cmd == 'update':
        cmd = safe_pop(args)
        if cmd == 'wafservice':
            update_wafservice()
        else:
            show_help_and_exit()
    else:
        show_help_and_exit()

    print('*** All work finished successfully, enjoy it~')

else:
    print('install.py had been imported as a module')
    print('please add group and user nginx:nginx')
    print('to use nginx, add it in PATH: \nexport PATH=/opt/wafservice/openresty/nginx/sbin:$PATH')
