import inquirer, { QuestionCollection } from "inquirer";
import download from "download-git-repo";
import path from "path";
import ora from "ora";

interface IPromptOption {
  /**
   * 项目名
   */
  projectName: string;
  /**
   * 下载的模板名
   */
  templateName: string;
}

interface TemplateInfo {
  // 模板压缩文件下载地址
  downloadUrl: string;
  // 模板描述
  desc: string;
}
const repositoryList: Record<string, TemplateInfo> = {
  vue3: {
    downloadUrl:
      "https://gitcode.net/pzy_666/front-project-template/-/raw/master/zip/vue3.zip?inline=false",
    desc: "vue3项目基础模板",
  },
  "vue3-element-plus": {
    downloadUrl:
      "https://gitcode.net/weixin_42365757/front-project-template/-/raw/master/zip/vue3-element-plus.zip?inline=false",
    desc: "vue3项目基础模板上整合进element-plus",
  },
  "vue3-vant": {
    downloadUrl:
      "https://gitcode.net/pzy_666/front-project-template/-/raw/master/zip/vue3-vant.zip?inline=false",
    desc: "vue3项目基础模板上整合进vant(适用移动端项目)",
  },
  "vitepress-doc": {
    downloadUrl:
      "https://gitcode.net/pzy_666/front-project-template/-/raw/master/zip/vitepress-doc.zip?inline=false",
    desc: "用于编写文档的vitepress模板",
  },
  "vue3-ui-lib": {
    downloadUrl:
      "https://gitcode.net/weixin_42365757/front-project-template/-/raw/master/zip/vue3-ui-lib.zip?inline=false",
    desc: "用于编写 vue3 ui 组件",
  },
};

const projectTemplateChoices = Object.keys(repositoryList).map(
  (propertyName) => ({
    name: repositoryList[propertyName].desc,
    value: propertyName,
  })
);

/**
 * 问题确认列表
 *
 * @var {[type]}
 */
const PROMPT_LIST: QuestionCollection = [
  {
    type: "input",
    message: "请输入项目名",
    name: "projectName",
    default: "demo",
  },
  {
    type: "list",
    message: "请选择需要的项目模板",
    name: "templateName",
    choices: projectTemplateChoices,
  },
];

function main() {
  inquirer.prompt<IPromptOption>(PROMPT_LIST).then(async (answer) => {
    const newOra = ora("开始创建项目...").start();
    const CURRENT_PATH = process.cwd(); // 获取当前路径
    const downloadUrl = `direct:${
      repositoryList[answer.templateName].downloadUrl
    }`;
    const targetPath = path.resolve(CURRENT_PATH, answer.projectName); // 目标路径
    await download(downloadUrl, targetPath, {}, (err: any) => {
      if (err) {
        newOra.fail(`项目创建失败:${err.message}`);
        console.log(err);
      } else {
        newOra.succeed(`项目创建成功

        cd ${answer.projectName}
        pnpm install
        pnpm run dev
        
        `);
      }
    });
  });
}

main();
