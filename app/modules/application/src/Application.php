<?php

namespace Biskuit;

use Biskuit\Application\Traits\EventTrait;
use Biskuit\Application\Traits\RouterTrait;
use Biskuit\Application\Traits\StaticTrait;
use Biskuit\Event\EventDispatcher;
use Biskuit\Module\ModuleManager;
use Symfony\Component\HttpFoundation\Request;

class Application extends Container
{
    use StaticTrait, EventTrait, RouterTrait;

    /**
     * @var bool
     */
    protected $booted = false;

    /**
     * Constructor.
     *
     * @param array $values
     */
    public function __construct(array $values = [])
    {
        parent::__construct($values);

        $this['events'] = function () {
            return new EventDispatcher();
        };

        $this['module'] = function () {
            return new ModuleManager($this);
         };
    }

    /**
     * Boots all modules.
     */
    public function boot()
    {
        if (!$this->booted) {

            $this->booted = true;
            $this->trigger('boot', [$this]);

        }
    }

    /**
     * Handles the request.
     *
     * @param Request $request
     */
    public function run(Request $request = null)
    {
        if ($request === null) {
            $request = Request::createFromGlobals();
        }

        if (!$this->booted) {
            $this->boot();
        }

        $response = $this['kernel']->handle($request);
        $response->send();

        $this['kernel']->terminate($request, $response);
    }

    /**
     * Checks if running in the console.
     *
     * @return bool
     */
    public function inConsole()
    {
        return PHP_SAPI == 'cli';
    }
}
